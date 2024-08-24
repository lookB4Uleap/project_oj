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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const file_1 = require("../utils/file");
const execute_1 = require("../utils/execute");
const router = (0, express_1.Router)();
var Languages;
(function (Languages) {
    Languages["c"] = "c";
    Languages["cpp"] = "cpp";
    Languages["py"] = "py";
})(Languages || (Languages = {}));
const executeCode = (language, filePath, inputs) => {
    if (language === Languages.c)
        return (0, execute_1.executeC)(filePath, inputs);
    else if (language === Languages.cpp)
        return (0, execute_1.executeCpp)(filePath, inputs);
    else if (language === Languages.py)
        return (0, execute_1.executePython)(filePath, inputs);
    return;
};
const execute = (language, code, inputs) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = (0, file_1.generateFile)(language, code);
        // const result = await executeCpp(filePath, inputs);
        const result = yield executeCode(language, filePath, inputs);
        console.log('[Run] Output', result);
        return { success: true, result, error: null };
    }
    catch (error) {
        return { success: false, result: null, error };
    }
});
router.post('/run', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const language = req.body.language;
    const code = req.body.code;
    const inputs = req.body.inputs;
    if (!language || !code)
        return res.status(400).json({ message: "Language or code is missing!" });
    const { success, result, error } = yield execute(language, code, inputs);
    if (error)
        return next(error);
    res.status(200).json({ message: 'Code Executed Successfully!', success, result });
}));
exports.default = router;
