"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.authorizeUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorizeUser = (userId, username, email) => {
    const secret = process.env.API_SECRET;
    const authToken = jsonwebtoken_1.default.sign({ userId, username, email }, secret, {
        expiresIn: '1h'
    });
    const refreshToken = jsonwebtoken_1.default.sign({ userId, username, email }, secret, {
        expiresIn: 60 * 60 * 24 * 30
    });
    return { authToken, refreshToken };
};
exports.authorizeUser = authorizeUser;
const verifyRefreshToken = (refreshToken) => {
    const secret = process.env.API_SECRET;
    try {
        let user = jsonwebtoken_1.default.verify(refreshToken, secret);
        return { user, error: null };
    }
    catch (error) {
        return { user: null, error };
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
