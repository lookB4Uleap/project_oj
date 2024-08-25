import { NextFunction, Request, Response, Router } from "express";
import Problem, { ProblemType } from "../models/problems";

const router = Router();

const saveProblem = async (problemProps: ProblemType) => {
    try {
        const problem = new Problem({
            problemTitle: problemProps.problemTitle,
            problemDescription: problemProps.problemDescription,
            inputDescription: problemProps.inputDescription,
            outputDescription: problemProps.outputDescription,
            points: problemProps.points
        });    
        const newProblem = await problem.save();
        return {problem: newProblem, error: null};
    } 
    catch (error: any) {
        return {problem: null, error};
    }
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    // Add Authorization
    const problemTitle = req.body.problemTitle;
    const problemDescription = req.body.problemDescription;
    const inputDescription = req.body.inputDescription;
    const outputDescription = req.body.outputDescription;
    const points = req.body.points;

    if (!problemTitle || !problemDescription || !inputDescription || !outputDescription || !points)
        return res.status(400).json({message: "Problem fields missing!"});

    const {problem, error} = await saveProblem({
        problemTitle,
        problemDescription,
        inputDescription,
        outputDescription,
        points
    });

    if (error)
        return next(error);

    res.status(201).json({message: 'Problem created successfully', problem});
});

const getProblems = async () => {
    try {
        const problems = await Problem.find().limit(10).lean();
        return {problems, error: null};
    } catch (error: any) {
        return {problems: null, error};
    }
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const {problems, error} = await getProblems();

    if (error)
        return next(error);

    res.status(200).json({problems});
});

export default router;