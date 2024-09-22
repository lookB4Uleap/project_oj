import jwt from 'jsonwebtoken';
import { FlattenMaps } from 'mongoose';

export const authorizeUser = (userId: string, username: string, email: string, roles?: FlattenMaps<{ [key: string]: boolean; }> | undefined) => {
    const secret = process.env.API_SECRET as jwt.Secret;

    const authToken = jwt.sign({ userId, username, email, roles }, secret, {
        expiresIn: '1h'
    });

    const refreshToken = jwt.sign({ userId, username, email, roles }, secret, {
        expiresIn: 60 * 60 * 24 * 30
    });

    return { authToken, refreshToken };
}

export const verifyRefreshToken = (refreshToken: string) => {
    const secret = process.env.API_SECRET as jwt.Secret;
    try {
        let user = jwt.verify(refreshToken, secret) as jwt.JwtPayload;
        return {user, error: null};
    } 
    catch(error: any) {
        return {user: null, error};
    }
}