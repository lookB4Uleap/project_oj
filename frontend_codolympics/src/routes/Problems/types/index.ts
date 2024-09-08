export type TestCaseInputOutputType = {
    input: string;
    output: string;
}

export type ProblemType = {
    _id?: string;
    problemTitle: string;
    problemDescription: string;
    inputDescription: string;
    outputDescription: string;
    sampleTestCases?: TestCaseInputOutputType[];
    points: number;
}