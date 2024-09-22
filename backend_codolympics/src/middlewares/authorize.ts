import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';

export type AuthPayload = {
    userId: string;
    username: string;
    email: string;
    roles?: {
        [key: string]: boolean
    };
}

export const authorize = (req: Request, res: Response, next: NextFunction) => {
    const apiSecret = process.env.API_SECRET;

    if (!apiSecret) {
        console.log('[Auth] Secret missing!');
        new Error('Authorization Failed');
        return;
    }
    if (
        !req.headers.authorization ||
        !req.headers.authorization.split(" ")[1]
    ) {
        console.log('[OrderMS] Authorization Failed!', { authorization: req.headers.authorization })
        // res.status(403).json({ error: "Authorization Failed!" });
        const authorizationFailedError = new Error('Authorization Failed');
        res.status(401);
        return next(authorizationFailedError);
    }

    // TODO: Added check for timedout authtokens
    const authToken = req.headers.authorization.split(" ")[1];
    // console.log({apiSecret, authToken});

    const { userId } = jwt.verify(authToken, apiSecret) as AuthPayload;
    req.body.userId = userId; 
    next();
}