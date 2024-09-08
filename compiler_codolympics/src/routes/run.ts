import { NextFunction, Request, Response, Router } from "express";
import { generateFile } from "../utils/generate-code-file";
import { execute, executeCode } from "../utils/execute";
import { generateInputFile } from "../utils/generate-input-file";
import { readOutputFile } from "../utils/read-output-file";

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
    const input = req.body.input;
    const inputFilePath = generateInputFile(input);

    if (!language || !code)
        return res.status(400).json({ message: "Language or code is missing!" });

    const { success, result, error } = await execute(language, code, inputFilePath);

    if (error)
        return next(error);

    res.status(200).json({ message: 'Code Executed Successfully!', success, result });
});

export default router;