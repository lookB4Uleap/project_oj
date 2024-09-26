import { NextFunction, Request, Response, Router } from "express";
import Testcase, { TestcaseType } from "../models/testcases";
import { authorize } from "../middlewares/authorize";
import { verifyAdmin } from "../middlewares/verify-admin";
import { v4 as uuid } from 'uuid';
import 'dotenv/config';
import { generatePresignedURL } from "../utils/file-upload";
import axios from "axios";

const router = Router();
const TESTCASE_TYPE = "visible";

export const saveTestcase = async (testcaseProp: TestcaseType) => {
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

router.post('/', authorize, verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    const problemId = req.body.problemId;
    const type = req.body.type ?? TESTCASE_TYPE;
    const points = req.body.points;
    const input = req.body.input.split("?")[0];
    const output = req.body.output.split("?")[0];

    if (!problemId || !input || !output)
        return res.status(400).json({ message: "Problem fields missing!" });

    const { testcase, error } = await saveTestcase({
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

const getTestcase = async (testcaseId: string) => {
    try {
        const testcase = await Testcase.findById(testcaseId).lean();
        return { testcase, error: null };
    }
    catch (error: any) {
        return { testcase: null, error };
    }
}

const getTestcaseDataFromUrl = async (url: string) => {
    const {data} = await axios.get(url);
    return data;
}

const getTestcaseData = async (input: string, output: string) => {
    try {
        const inputRequest = getTestcaseDataFromUrl(input);
        const outputRequest = getTestcaseDataFromUrl(output);
        const [inputData, outputData] = await Promise.all([inputRequest, outputRequest]);
        return {inputData, outputData, error: null};
    } catch (error: any) {
        return {inputData: null, outputData: null, error};
    }
}

router.get("/:id", authorize, async (req: Request, res: Response, next: NextFunction) => {
    const testcaseId = req.params.id;
    const { testcase, error: FetchTestcaseError } = await getTestcase(testcaseId);
    if (FetchTestcaseError) 
        return next(FetchTestcaseError);
    if (!testcase?.input || !testcase?.output)
        return res.status(400).json({message: "Invalid testcase!"});

    const {inputData, outputData, error: LoadTestcaseError} = await getTestcaseData(testcase?.input, testcase?.output);
    if (LoadTestcaseError)
        return next(LoadTestcaseError);

    res.status(200).json({input: inputData, output: outputData});

});

router.get('/upload', authorize, verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    const fileId = uuid();
    const fileName = `${fileId}.txt`;
    const bucketName = process.env.AWS_S3_BUCKET;
    if (!bucketName) {
        console.log('[backend-codolympics] Bucket name is empty', bucketName);
        return res.status(500).json({ message: "Internal server error!" });
    }

    const { url, error } = await generatePresignedURL(bucketName, fileName);

    if (error)
        return next(error);

    res.status(200).json({ fileName, url });
});

export default router;