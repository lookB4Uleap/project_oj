import { NextFunction, Request, Response, Router } from "express";
import Submission from "../models/submissions";
import { authorize } from "../middlewares/authorize";
import Problem from "../models/problems";

const router = Router();

const getSubmissions = async (userId: string) => {
    try {
        const submissions = await Submission.aggregate([
            { $match: { userId } },
            {
                $lookup: {
                    from: "problems",
                    let: { problemId: '$problemId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $toString: '$_id' }, '$$problemId']
                                }
                            }
                        },
                        {
                            $project: { problemTitle: 1, _id: 0 }
                        }
                    ],
                    as: "problem"
                },
            },
            { $unwind: '$problem' },
            {
                $addFields: {
                    problemTitle: "$problem.problemTitle"
                }
            },
            {
                $project: {
                    problem: 0
                }
            },
            { $sort: { updatedAt: -1 } }
        ]);

        return { submissions, error: null };
    }
    catch (error: any) {
        return { submissions: null, error };
    }
}

router.get('/', authorize, async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const { submissions, error } = await getSubmissions(userId);
    if (error)
        return next(error);
    // console.log('[backend] Submissions', submissions);
    res.status(200).json(submissions);
});

export default router;