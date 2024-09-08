"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const authorize = (req, res, next) => {
    const apiSecret = process.env.API_SECRET;
    if (!apiSecret) {
        console.log('[Auth] Secret missing!');
        new Error('Authorization Failed');
        return;
    }
    if (!req.headers.authorization ||
        !req.headers.authorization.split(" ")[1]) {
        console.log('[OrderMS] Authorization Failed! Envs missing. ', { authorization: req.headers.authorization });
        // res.status(403).json({ error: "Authorization Failed!" });
        const authorizationFailedError = new Error('Authorization Failed');
        res.status(401);
        return next(authorizationFailedError);
    }
    // TODO: Added check for timedout authtokens
    const authToken = req.headers.authorization.split(" ")[1];
    const { userId } = jsonwebtoken_1.default.verify(authToken, apiSecret);
    req.body.userId = userId;
    next();
};
exports.authorize = authorize;
