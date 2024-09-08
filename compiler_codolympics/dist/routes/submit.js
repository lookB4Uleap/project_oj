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
const testcases_1 = __importDefault(require("../models/testcases"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const generate_file_path_1 = require("../utils/generate-file-path");
const execute_1 = require("../utils/execute");
const read_output_file_1 = require("../utils/read-output-file");
const authorize_1 = require("../middleware/authorize");
const submissions_1 = __importDefault(require("../models/submissions"));
const router = (0, express_1.Router)();
const getTestcases = (problemId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const testcases = yield testcases_1.default.find({
            problemId
        }).lean();
        return { testcases, error: null };
    }
    catch (error) {
        return { testcases: null, error };
    }
});
const getTestFile = (url, dir) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = (0, generate_file_path_1.generateFilePath)(dir);
    const response = yield axios_1.default.get(url, { responseType: 'arraybuffer' });
    const fileData = Buffer.from(response.data, 'binary');
    (0, fs_1.writeFileSync)(filePath, fileData);
    return filePath;
});
const runTestcases = (testcases, language, code) => __awaiter(void 0, void 0, void 0, function* () {
    let success = true, tests = 0, passed = 0;
    try {
        const runTestcasesAsync = testcases === null || testcases === void 0 ? void 0 : testcases.map((testcase) => __awaiter(void 0, void 0, void 0, function* () {
            tests++;
            const testcaseInputFilePath = yield getTestFile(testcase.input, 'inputs');
            const testcaseOutputFilePath = yield getTestFile(testcase.output, 'outputs');
            const { result } = yield (0, execute_1.execute)(language, code, testcaseInputFilePath);
            if (!testcaseOutputFilePath)
                return; // highly unlikely to get a empty output in testcase
            const outputTestcase = (0, read_output_file_1.readOutputFile)(testcaseOutputFilePath);
            if (outputTestcase.trim() !== (result === null || result === void 0 ? void 0 : result.trim())) {
                success = false;
                return;
            }
            passed++;
        }));
        yield Promise.all(runTestcasesAsync);
        return { success, tests, passed, error: null };
    }
    catch (error) {
        return { success: false, tests, passed, error };
    }
});
const saveSubmission = (submission) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSubmission = yield submissions_1.default.findOneAndUpdate({
            "$and": [
                { problemId: submission.problemId },
                { userId: submission.userId }
            ]
        }, submission, { upsert: true, new: true }).lean();
        return { submission: newSubmission, error: null };
    }
    catch (error) {
        return { submission: null, error };
    }
});
router.post('/:problemId', authorize_1.authorize, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const problemId = req.params.problemId;
    const userId = req.body.userId;
    const language = req.body.language;
    const code = req.body.code;
    if (!language || !code)
        return res.status(400).json({ message: "Language or code is missing!" });
    const { testcases, error: TestcaesFetchingError } = yield getTestcases(problemId);
    if (!testcases)
        return res.status(400).json({ message: "Testcases are missing!" });
    if (TestcaesFetchingError)
        return next(TestcaesFetchingError);
    const { success, tests, passed, error: TestcasesRunningError } = yield runTestcases(testcases, language, code);
    if (TestcasesRunningError)
        return next(TestcasesRunningError);
    const { submission, error: SavingSubmissionError } = yield saveSubmission({
        problemId,
        userId,
        points: tests,
        tests,
        passed,
        verdict: success ? "Passed" : "Failed"
    });
    // TODO: Save points based on problem statement
    if (SavingSubmissionError)
        return next(SavingSubmissionError);
    res.status(200).json({ message: 'Execution completed', submission });
}));
exports.default = router;
