"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const auth_1 = require("../utils/auth");
const router = (0, express_1.Router)();
const SALT = 10;
const getUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ username }).lean();
        return { user, error: null };
    }
    catch (error) {
        return { user: null, error };
    }
});
const validatePassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valid = yield bcryptjs_1.default.compare(password, hash);
        return { valid, error: null };
    }
    catch (error) {
        const invalidLoginError = new Error("Invalid Login Credentials");
        return { valid: null, error: invalidLoginError };
    }
});
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const { user, error } = yield getUser(username);
    if (error) {
        next(error);
        return;
    }
    console.log('[user] User ', user === null || user === void 0 ? void 0 : user._id.toString());
    if (!(user === null || user === void 0 ? void 0 : user._id) || !(user === null || user === void 0 ? void 0 : user.password)) {
        res.status(400).json({ message: "No such user." });
        return;
    }
    const { valid, error: invalidLoginError } = yield validatePassword(password, user.password);
    if (invalidLoginError) {
        res.status(401);
        next(invalidLoginError);
        return;
    }
    if (!valid) {
        res.status(401).json({ message: 'Invalid Login Credentials!' });
        return;
    }
    const tokens = (0, auth_1.authorizeUser)(user === null || user === void 0 ? void 0 : user._id.toString(), user.username, user.email);
    res.header("Access-Control-Allow-Origin: *");
    res.header("Access-Control-Allow-Credentials: true");
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        path: '/',
        domain: undefined
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
}));
const saveUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield user.save();
        return { newUser, error: null };
    }
    catch (error) {
        return { newUser: null, error };
    }
});
router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = yield bcryptjs_1.default.hash(password, SALT);
    const user = new user_1.default({
        username,
        email,
        password: hashedPassword
    });
    const { newUser, error } = yield saveUser(user);
    if (error) {
        next(error);
        return;
    }
    if (!newUser) {
        res.status(500).json({ message: "Failed to created new user!" });
        return;
    }
    const tokens = (0, auth_1.authorizeUser)(newUser === null || newUser === void 0 ? void 0 : newUser._id.toString(), newUser.username, newUser.email);
    res.header("Access-Control-Allow-Origin: *");
    res.header("Access-Control-Allow-Credentials: true");
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
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
}));
router.post('/auth', (req, res, next) => {
    const { cookie } = req.headers;
    console.log('[User] Cookie ', cookie);
    if (!cookie) {
        res.status(401).json({ message: 'Unauthorized!' });
        return;
    }
    const refreshToken = cookie.split("refreshToken=")[1].split(";")[0];
    const { user, error } = (0, auth_1.verifyRefreshToken)(refreshToken);
    if (error) {
        next(error);
        return;
    }
    if (!user) {
        res.status(401).json({ message: 'Unauthorized!' });
        return;
    }
    const tokens = (0, auth_1.authorizeUser)(user.userId, user.username, user.email);
    res.header("Access-Control-Allow-Origin: *");
    res.header("Access-Control-Allow-Credentials: true");
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
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
exports.default = router;
