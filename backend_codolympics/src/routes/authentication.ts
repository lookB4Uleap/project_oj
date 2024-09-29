import { CookieOptions, NextFunction, Request, Response, Router } from "express";
import bcrypt from 'bcryptjs';
import User, { UserType } from "../models/user";
import { authorizeUser, verifyRefreshToken } from "../utils/auth";
import { Document } from "mongoose";

const router = Router();

const SALT = 10;

enum Environment {
    production = "production",
    development = "development"
}

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === Environment.development ? false : true, // Use in production with HTTPS
    sameSite: process.env.NODE_ENV === Environment.development ? 'strict' : 'none', // Adjust as needed
    maxAge: 1000 * 60 * 60 * 24 * 30
};

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

    // console.log('[user] User ', user?._id.toString());
    console.log('[user] User ', user);

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

    const tokens = authorizeUser(user?._id.toString(), user.username, user.email, user?.roles);
    res.header("Access-Control-Allow-Origin: *");
    res.header("Access-Control-Allow-Credentials: true");
    res.cookie('refreshToken', tokens.refreshToken,
        // {
        //     httpOnly: true,
        //     secure: false, // Use in production with HTTPS
        //     sameSite: 'strict', // Adjust as needed
        //     maxAge: 1000 * 60 * 60 * 24 * 30,
        //     path: '/',
        //     domain: undefined
        // }
        cookieOptions
    ).status(200).json({
        message: 'User logged in.',
        tokens: {
            authToken: tokens.authToken
        },
        user: {
            userId: user._id,
            username: user.username,
            email: user.email,
            roles: user?.roles
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

    const tokens = authorizeUser(newUser?._id.toString(), newUser.username, newUser.email, newUser?.roles);
    res.header("Access-Control-Allow-Origin: *");
    res.header("Access-Control-Allow-Credentials: true");
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions).status(201).json({
        message: 'User created.',
        tokens: {
            authToken: tokens.authToken
        },
        user: {
            userId: newUser._id,
            username: newUser.username,
            email: newUser.email,
            roles: newUser?.roles
        }
    });
});

router.post('/auth', (req: Request, res: Response, next: NextFunction) => {
    const { cookie } = req.headers;
    console.log('[User] Cookie ', cookie);

    if (!cookie) {
        res.status(401).json({ message: 'Unauthorized!' });
        return;
    }

    const refreshToken = cookie.split("refreshToken=")[1].split(";")[0];

    const { user, error } = verifyRefreshToken(refreshToken);
    if (error) {
        next(error);
        return;
    }

    if (!user) {
        res.status(401).json({ message: 'Unauthorized!' });
        return;
    }

    const tokens = authorizeUser(user.userId, user.username, user.email, user?.roles);
    res.header("Access-Control-Allow-Origin: *");
    res.header("Access-Control-Allow-Credentials: true");
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions).status(200).json({
        message: 'User authenticated.',
        tokens: {
            authToken: tokens.authToken
        },
        user: {
            userId: user.userId,
            username: user.username,
            email: user.email,
            roles: user?.roles
        }
    });
});

router.post('/logout', async (req: Request, res: Response) => {
    res.clearCookie('refreshToken').status(200).json({ message: 'Successfully logged out!' });
});

const getUsers = async () => {
    try {
        const users = await User.find({}, { username: 1, email: 1, points: 1 }).sort({ points: -1 }).limit(10).lean();
        return {users, error: null};
    }
    catch(error: any) {
        return {users: null, error};
    }
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const {users, error} = await getUsers();
    if (error)
        return next(error);
    res.status(200).json(users);
});

export default router;