import { NextFunction, Request, Response, Router } from "express";
import Testcase, { TestcaseType } from "../models/testcases";

const router = Router();
const TESTCASE_TYPE = "visible";

const saveTestcase = async (testcaseProp: TestcaseType) => {
    try {
        const testcase = new Testcase({
            problemId: testcaseProp.problemId,
            type: testcaseProp.type,
            input: testcaseProp.input,
            output: testcaseProp.output
        });
        const newTestcase = await testcase.save();
        return { testcase: newTestcase, error: null };
    }
    catch (error: any) {
        return { testcase: null, error };
    }
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const problemId = req.body.problemId;
    const type = req.body.type ?? TESTCASE_TYPE;
    const points = req.body.points;
    const input = req.body.input;
    const output = req.body.input;

    if (!problemId || !points || !input || !output)
        return res.status(400).json({ message: "Problem fields missing!" });

    const {testcase, error} = await saveTestcase({
        problemId,
        type,
        points,
        input,
        output
    });

    if (error)
        return next(error);

    res.status(201).json({ message: 'Testcase created successfully', testcase });
});

export default router;