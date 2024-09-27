export type TestCaseInputOutputType = {
    _id: string;
    input: string;
    output: string;
}

export type ProblemType = {
    _id?: string;
    problemTitle: string;
    problemDescription: string;
    inputDescription: string;
    outputDescription: string;
    sampleTestcases: TestCaseInputOutputType[];
    visibleTestcases?: {
        _id: string;
        input: string;
    }[];
    points: number;
}

export type SubmissionType = {
    userId: string;
    problemId: string;
    tests: number;
    passed: number;
    points: number;
    verdict: string;
    open?: boolean;
}