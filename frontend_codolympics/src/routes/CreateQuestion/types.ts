export type TestcaseType = {
    inputFile: File | null;
    outputFile: File | null;
    type?: "sample" | "hidden" | "visible";
};

export type TestcaseUploadUrlsType = {
    inputUploadUrl: string;
    outputUploadUrl: string;
    type?: "sample" | "hidden" | "visible";
}

export type ProblemType = {
    problemTitle: string;
    problemDescription: string;
    inputDescription: string;
    outputDescription: string;
    points: number;
    testcases: TestcaseType[];
};

export enum Actions {
    CHANGE_PROBLEM_TITLE = "CHANGE_PROBLEM_TITLE",
    CHANGE_PROBLEM_DESCRIPTION = "CHANGE_PROBLEM_DESCRIPTION",
    CHANGE_INPUT_DESCRIPTION = "CHANGE_INPUT_DESCRIPTION",
    CHANGE_OUTPUT_DESCRIPTION = "CHANGE_OUTPUT_DESCRIPTION",
    CHANGE_POINTS = "CHANGE_POINTS",
    CHANGE_PROBLEM = "CHANGE_PROBLEM",
    CHANGE_TESTCASES = "CHANGE_TESTCASES"
}

export type ActionType = {
    type: Actions;
    problemTitle?: string;
    problemDescription?: string;
    inputDescription?: string;
    outputDescription?: string;
    points?: number;
    problem?: ProblemType,
    testcase?: {
        testcase: TestcaseType,
        index: number
    };
};