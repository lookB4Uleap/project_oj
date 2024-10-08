import { NextFunction, Request, Response, Router } from "express";
import Problem, { ProblemType } from "../models/problems";
import { authorize } from "../middlewares/authorize";
import { verifyAdmin } from "../middlewares/verify-admin";
import { Types } from "mongoose";
import { TestcaseTypes } from "../models/testcases";

const router = Router();

const saveProblem = async (problemProps: ProblemType) => {
    try {
        const problem = new Problem({
            problemTitle: problemProps.problemTitle,
            problemDescription: problemProps.problemDescription,
            inputDescription: problemProps.inputDescription,
            outputDescription: problemProps.outputDescription,
            points: problemProps.points,
            code: problemProps?.code,
            lang: problemProps?.lang,
            tags: problemProps?.tags
        });
        const newProblem = await problem.save();
        return { problem: newProblem, error: null };
    }
    catch (error: any) {
        return { problem: null, error };
    }
}

router.post('/', authorize, verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    // Add Authorization
    const problemTitle = req.body.problemTitle;
    const problemDescription = req.body.problemDescription;
    const inputDescription = req.body.inputDescription;
    const outputDescription = req.body.outputDescription;
    const points = req.body.points;
    const code = req.body?.code;
    const lang = req.body?.lang;
    const tags = req.body?.tags;

    if (!problemTitle || !problemDescription || !inputDescription || !outputDescription || !points || !code || !lang || !tags)
        return res.status(400).json({ message: "Problem fields missing!" });

    const { problem, error } = await saveProblem({
        problemTitle,
        problemDescription,
        inputDescription,
        outputDescription,
        points,
        code,
        lang,
        tags
    });

    if (error)
        return next(error);

    res.status(201).json({ message: 'Problem created successfully.', problem });
});

const getProblems = async (search?: string|null) => {
    try {
        let problems;
        if (!search || search === "")
            problems = await Problem.find({}, {code: 0, lang: 0}).lean();
        else
            problems = await Problem.find({
                $text: {$search: search}    
            }, {
                _id: 1,
                problemTitle: 1,
                problemDescription: 1,
                inputDescription: 1,
                outputDescription: 1,
                points: 1,
                createdAt: 1,
                updatedAt: 1,
                score: { $meta: "textScore" }
            }).sort({ score: { $meta: "textScore" } }).lean();
        return { problems, error: null };
    } catch (error: any) {
        return { problems: null, error };
    }
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const search = req.query.search as string|null|undefined;
    const { problems, error } = await getProblems(search);

    if (error)
        return next(error);

    res.status(200).json({ problems });
});

const getProblem = async (id: string) => {
    try {
        const problem = await Problem.findById(id).lean();
        return { problem, error: null };
    } catch (error: any) {
        return { problem: null, error };
    }
}

const getProblemWithTestcases = async (id: string) => {
    try {
        const problemId = new Types.ObjectId(id);
        const problems = await Problem.aggregate([
            { $match: { _id: problemId } },
            {
                $lookup: {
                    from: "testcases",
                    let: { id: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $toString: '$$id' }, '$problemId']
                                }
                            }
                        },
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$type', TestcaseTypes.sample]
                                }
                            }
                        },
                        {
                            $project: {
                                input: 1,
                                output: 1
                            }
                        }
                    ],
                    as: "sampleTestcases"
                },
            },
            {
                $lookup: {
                    from: "testcases",
                    let: { id: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $toString: '$$id' }, '$problemId']
                                }
                            }
                        },
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$type', TestcaseTypes.visible]
                                }
                            }
                        },
                        {
                            $project: {
                                input: 1
                            }
                        }
                    ],
                    as: "visibleTestcases"
                },
            },
            {
                $project: {
                    tags: 1,
                    problemTitle: 1,
                    problemDescription: 1,
                    inputDescription: 1,
                    outputDescription: 1,
                    points: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    sampleTestcases: { $slice: ["$sampleTestcases", 2] },
                    visibleTestcases: { $slice: ["$visibleTestcases", 1] },
                }
            }
        ]);
        return { problem: problems?.[0], error: null };
    } catch (error: any) {
        return { problem: null, error };
    }
}

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    // const {problems, error} = await getProblems();
    const { problem, error } = await getProblemWithTestcases(id);

    if (error)
        return next(error);

    res.status(200).json({ problem });
});

export default router;