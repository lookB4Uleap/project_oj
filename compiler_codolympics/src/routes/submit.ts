import { NextFunction, Request, Response, Router } from "express";
import Testcase, { TestcaseType } from "../models/testcases";
import axios from "axios";
import { writeFileSync } from "fs";
import { error } from "console";
import { generateFilePath } from "../utils/generate-file-path";
import { execute } from "../utils/execute";
import { readOutputFile } from "../utils/read-output-file";
import { authorize } from "../middleware/authorize";
import Submission, { SubmissionType } from "../models/submissions";

const router = Router();

const getTestcases = async (problemId: string) => {
    try {
        const testcases: TestcaseType[] = await Testcase.find({
            problemId
        }).lean();
        return { testcases, error: null };
    }
    catch (error: any) {
        return { testcases: null, error };
    }
}

const getTestFile = async (url: string, dir: string) => {
    const filePath = generateFilePath(dir);
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const fileData = Buffer.from(response.data, 'binary');
    writeFileSync(filePath, fileData);
    return filePath;
}

const runTestcases = async (testcases: TestcaseType[], language: string, code: string) => {
    let success = true, tests = 0, passed = 0;
    try {
        const runTestcasesAsync = testcases?.map(async testcase => {
            tests++;
            const testcaseInputFilePath = await getTestFile(testcase.input, 'inputs');
            const testcaseOutputFilePath = await getTestFile(testcase.output, 'outputs');

            const { result } = await execute(language, code, testcaseInputFilePath);

            if (!testcaseOutputFilePath)
                return; // highly unlikely to get a empty output in testcase
            const outputTestcase = readOutputFile(testcaseOutputFilePath);
            if (outputTestcase.trim() !== result?.trim()) {
                success = false;
                return;
            }
            passed++;
        });

        await Promise.all(runTestcasesAsync);

        return { success, tests, passed, error: null };
    }
    catch (error: any) {
        return { success: false, tests, passed, error };
    }
}

const saveSubmission = async (submission: SubmissionType) => {
    try {
        const newSubmission = await Submission.findOneAndUpdate({
            "$and": [
                { problemId: submission.problemId },
                { userId: submission.userId }
            ]
        },
            submission,
            { upsert: true, new: true }
        ).lean();
        return { submission: newSubmission, error: null };
    }
    catch (error: any) {
        return { submission: null, error };
    }
}

router.post('/:problemId', authorize, async (req: Request, res: Response, next: NextFunction) => {
    const problemId = req.params.problemId;
    const userId: string = req.body.userId;
    const language = req.body.language;
    const code = req.body.code;

    if (!language || !code)
        return res.status(400).json({ message: "Language or code is missing!" });

    const { testcases, error: TestcaesFetchingError } = await getTestcases(problemId);
    if (!testcases)
        return res.status(400).json({ message: "Testcases are missing!" });
    if (TestcaesFetchingError)
        return next(TestcaesFetchingError);

    const { success, tests, passed, error: TestcasesRunningError } = await runTestcases(testcases, language, code);
    if (TestcasesRunningError)
        return next(TestcasesRunningError);

    const { submission, error: SavingSubmissionError } = await saveSubmission({
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
});

export default router;