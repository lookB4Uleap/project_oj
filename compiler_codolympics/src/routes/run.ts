import { NextFunction, Request, Response, Router } from "express";
import { generateFile } from "../utils/file";
import { executeC, executeCpp, executePython } from "../utils/execute";

const router = Router();

enum Languages {
    c = 'c',
    cpp = 'cpp',
    py = 'py'
}

const executeCode = (language: string, filePath: string, inputs?: string) => {
    if (language === Languages.c)
        return executeC(filePath, inputs);
    else if (language === Languages.cpp)
        return executeCpp(filePath, inputs);
    else if (language === Languages.py)
        return executePython(filePath, inputs);
    return;
}

const execute = async (language: string, code: string, inputs?: string) => {
    try {
        const filePath = generateFile(language, code);
        // const result = await executeCpp(filePath, inputs);
        const result = await executeCode(language, filePath, inputs);
        console.log('[Run] Output', result);
        return { success: true, result, error: null };
    }
    catch (error: any) {
        return { success: false, result: null, error };
    }
}

router.post('/run', async (req: Request, res: Response, next: NextFunction) => {
    const language = req.body.language;
    const code = req.body.code;
    const inputs = req.body.inputs;

    if (!language || !code)
        return res.status(400).json({ message: "Language or code is missing!" });

    const { success, result, error } = await execute(language, code, inputs);

    if (error)
        return next(error);

    res.status(200).json({ message: 'Code Executed Successfully!', success, result });
});

export default router;