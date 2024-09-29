import { NextFunction, Request, Response, Router } from "express";
import { generateFile } from "../utils/generate-code-file";
import { execute, executeCode } from "../utils/execute";
import { generateInputFile } from "../utils/generate-input-file";
import { readOutputFile } from "../utils/read-output-file";
import Problem from "../models/problems";
import { error } from "console";

const router = Router();

enum Languages {
    c = 'c',
    cpp = 'cpp',
    py = 'py'
}

// const executeCode = (language: string, filePath: string, input?: string) => {
//     if (language === Languages.c)
//         return executeC(filePath, input);
//     else if (language === Languages.cpp)
//         return executeCpp(filePath, input);
//     else if (language === Languages.py)
//         return executePython(filePath, input);
//     return;
// }


router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const language = req.body.language;
    const code = req.body.code;
    const input = String(req.body.input);
    const inputFilePath = generateInputFile(input);

    if (!language || !code)
        return res.status(400).json({ message: "Language or code is missing!" });

    const { success, result, error } = await execute(language, code, inputFilePath);

    if (error)
        return next(error);

    res.status(200).json({ message: 'Code Executed Successfully!', success, result });
});

const getProblemCode = async (problemId: string) => {
    try {
        const problem = await Problem.findById(problemId, {code: 1, lang: 1}).lean();
        return {problem, error: null};
    } catch (error: any) {
        return {problem: null, error};
    }
} 

router.post('/:problemId', async (req: Request, res: Response, next: NextFunction) => {
    // TODO Should I add an authorization here?
    const problemId = req.params.problemId;
    const input = String(req.body.input);
    console.log('[run] input ', input);
    const {problem, error: ProblemCodeError} = await getProblemCode(problemId);
    if (ProblemCodeError)
        return next(ProblemCodeError);

    const inputFilePath = generateInputFile(input);

    if (!problem?.lang || !problem?.code || !input)
        return res.status(400).json({ message: "Language, code or input is missing!" });

    const { success, result, error: CodeExecutionError } = await execute(problem.lang, problem.code, inputFilePath);

    if (CodeExecutionError)
        return next(CodeExecutionError);

    res.status(200).json({ message: 'Code Executed Successfully!', success, result });
});

export default router;