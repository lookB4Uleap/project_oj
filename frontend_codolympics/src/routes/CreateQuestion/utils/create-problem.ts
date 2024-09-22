import { api } from "../../../api";
import { ProblemType } from "../types";

export const createProblem = async (problem: ProblemType, authToken: string) => {
    const {data} = await api.post('/api/v1/problems', {
        problemTitle: problem.problemTitle,
        problemDescription: problem.problemDescription,
        inputDescription: problem.inputDescription,
        outputDescription: problem.outputDescription,
        points: problem.points 
    }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });

    return data.problem;
}