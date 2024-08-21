import { NextFunction, Request, Response, Router } from "express";
import { generateFile } from "../utils/file";
import { executeCpp } from "../utils/execute";

const router = Router();

const execute = async (language: string, code: string) => {
    try {
        const filePath = generateFile(language, code);
        const result = await executeCpp(filePath);
        console.log('[Run] Output', result);
        return {success: true, error: null};
    }
    catch(error: any) {
        return {success: false, error};
    }
}

router.post('/run', async (req: Request, res: Response, next: NextFunction) => {
    const language = req.body.language;
    const code = req.body.code;

    if (!language || !code) 
        return res.status(400).json({message: "Language or code is missing!"});

    const {success, error} = await execute(language, code);
    
    if (error)
        return next(error);

    res.status(200).json({message: 'Code Executed Successfully!', success});
});

export default router;