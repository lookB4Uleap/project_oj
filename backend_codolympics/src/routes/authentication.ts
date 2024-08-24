import { NextFunction, Request, Response, Router } from "express";
import bcrypt from 'bcryptjs';
import User, { UserType } from "../models/user";
import { authorizeUser, verifyRefreshToken } from "../utils/auth";
import { Document } from "mongoose";

const router = Router();

const SALT = 10;

const getUser = async (username: string) => {
    try {
        const user = await User.findOne({ username }).lean();
        return { user, error: null };
    } 
    catch (error: any) {
        return { user: null, error }
    }
}

const validatePassword = async (password: string, hash: string) => {
    try {
        const valid = await bcrypt.compare(password, hash);
        return { valid, error: null };
    } 
    catch (error: any) {
        const invalidLoginError = new Error("Invalid Login Credentials");
        return { valid: null, error: invalidLoginError };
    }
}

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const password = req.body.password;

    const { user, error } = await getUser(username);
    if (error) {
        next(error);
        return;
    }

    console.log('[user] User ', user?._id.toString());

    if (!user?._id || !user?.password) {
        res.status(400).json({ message: "No such user." });
        return;
    }

    const { valid, error: invalidLoginError } = await validatePassword(password, user.password);

    if (invalidLoginError) {
        res.status(401);
        next(invalidLoginError);
        return;
    }

    if (!valid) {
        res.status(401).json({ message: 'Invalid Login Credentials!' });
        return;
    }

    const tokens = authorizeUser(user?._id.toString(), user.username, user.email);
    res.header("Access-Control-Allow-Origin: *");
    res.header("Access-Control-Allow-Credentials: true");
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false, // Use in production with HTTPS
        sameSite: 'none', // Adjust as needed
        maxAge: 1000 * 60 * 60 * 24 * 30
    }).status(200).json({ 
        message: 'User logged in.', 
        tokens: {
            authToken: tokens.authToken
        },
        user: {
            userId: user._id,
            username: user.username,
            email: user.email
        }
    });
});

const saveUser = async (user: Document<unknown, {}, UserType> & UserType & Required<{ _id: string; }>) => {
    try {
        const newUser = await user.save();
        return { newUser, error: null };
    }
    catch (error: any) {
        return { newUser: null, error };
    }
}

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, SALT);

    const user = new User({
        username,
        email,
        password: hashedPassword
    });

    const { newUser, error } = await saveUser(user);
    if (error) {
        next(error);
        return;
    }

    if (!newUser) {
        res.status(500).json({ message: "Failed to created new user!" })
        return;
    }

    const tokens = authorizeUser(newUser?._id.toString(), newUser.username, newUser.email);
    res.header("Access-Control-Allow-Origin: *");
    res.header("Access-Control-Allow-Credentials: true");
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false, // Use in production with HTTPS
        sameSite: 'none', // Adjust as needed
        maxAge: 1000 * 60 * 60 * 24 * 30
    }).status(201).json({ 
        message: 'User created.', 
        tokens: {
            authToken: tokens.authToken
        },
        user: {
            userId: newUser._id,
            username: newUser.username,
            email: newUser.email
        }
    });
});

router.post('/auth', (req: Request, res: Response, next: NextFunction) => {
    const {cookie} = req.headers;
    console.log('[User] Cookie ', cookie);

    if (!cookie) {
        res.status(401).json({message: 'Unauthorized!'});
        return;
    }

    const refreshToken = cookie.split("refreshToken=")[1].split(";")[0];

    const {user, error} = verifyRefreshToken(refreshToken);
    if (error) {
        next(error);
        return;
    }

    if (!user) {
        res.status(401).json({message: 'Unauthorized!'});
        return;
    }

    const tokens = authorizeUser(user.userId, user.username, user.email);
    res.header("Access-Control-Allow-Origin: *");
    res.header("Access-Control-Allow-Credentials: true");
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false, // Use in production with HTTPS
        sameSite: 'none', // Adjust as needed
        maxAge: 1000 * 60 * 60 * 24 * 30
    }).status(201).json({ 
        message: 'User created.', 
        tokens: {
            authToken: tokens.authToken
        },
        user: {
            userId: user.userId,
            username: user.username,
            email: user.email
        }
    });
});

export default router;