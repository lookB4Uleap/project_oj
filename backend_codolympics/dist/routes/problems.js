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
const problems_1 = __importDefault(require("../models/problems"));
const router = (0, express_1.Router)();
const saveProblem = (problemProps) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const problem = new problems_1.default({
            problemTitle: problemProps.problemTitle,
            problemDescription: problemProps.problemDescription,
            inputDescription: problemProps.inputDescription,
            outputDescription: problemProps.outputDescription,
            points: problemProps.points
        });
        const newProblem = yield problem.save();
        return { problem: newProblem, error: null };
    }
    catch (error) {
        return { problem: null, error };
    }
});
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Add Authorization
    const problemTitle = req.body.problemTitle;
    const problemDescription = req.body.problemDescription;
    const inputDescription = req.body.inputDescription;
    const outputDescription = req.body.outputDescription;
    const points = req.body.points;
    if (!problemTitle || !problemDescription || !inputDescription || !outputDescription || !points)
        return res.status(400).json({ message: "Problem fields missing!" });
    const { problem, error } = yield saveProblem({
        problemTitle,
        problemDescription,
        inputDescription,
        outputDescription,
        points
    });
    if (error)
        return next(error);
    res.status(201).json({ message: 'Problem created successfully', problem });
}));
const getProblems = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const problems = yield problems_1.default.find().limit(10).lean();
        return { problems, error: null };
    }
    catch (error) {
        return { problems: null, error };
    }
});
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { problems, error } = yield getProblems();
    if (error)
        return next(error);
    res.status(200).json({ problems });
}));
exports.default = router;
