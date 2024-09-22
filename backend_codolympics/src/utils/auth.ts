import jwt from 'jsonwebtoken';

export const authorizeUser = (userId: string, username: string, email: string) => {
    const secret = process.env.API_SECRET as jwt.Secret;

    const authToken = jwt.sign({ userId, username, email }, secret, {
        expiresIn: '1h'
    });

    const refreshToken = jwt.sign({ userId, username, email }, secret, {
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