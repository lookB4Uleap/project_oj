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
const execute_1 = require("../utils/execute");
const generate_input_file_1 = require("../utils/generate-input-file");
const router = (0, express_1.Router)();
var Languages;
(function (Languages) {
    Languages["c"] = "c";
    Languages["cpp"] = "cpp";
    Languages["py"] = "py";
})(Languages || (Languages = {}));
// const executeCode = (language: string, filePath: string, input?: string) => {
//     if (language === Languages.c)
//         return executeC(filePath, input);
//     else if (language === Languages.cpp)
//         return executeCpp(filePath, input);
//     else if (language === Languages.py)
//         return executePython(filePath, input);
//     return;
// }
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const language = req.body.language;
    const code = req.body.code;
    const input = req.body.input;
    const inputFilePath = (0, generate_input_file_1.generateInputFile)(input);
    if (!language || !code)
        return res.status(400).json({ message: "Language or code is missing!" });
    const { success, result, error } = yield (0, execute_1.execute)(language, code, inputFilePath);
    if (error)
        return next(error);
    res.status(200).json({ message: 'Code Executed Successfully!', success, result });
}));
exports.default = router;
