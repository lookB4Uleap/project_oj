export type TestcaseType = {
    inputFile: File | null;
    outputFile: File | null;
    type?: "sample" | "hidden" | "visible";
};

export type TestcaseUploadUrlsType = {
    inputUploadUrl: string;
    outputUploadUrl: string;
    type?: "sample" | "hidden" | "visible";
};

export type ProblemType = {
    problemTitle: string;
    problemDescription: string;
    tags: string;
    inputDescription: string;
    outputDescription: string;
    points: number;
    testcases: TestcaseType[];
    lang?: string;
    code?: string;
};

export enum Actions {
    CHANGE_PROBLEM_TITLE = "CHANGE_PROBLEM_TITLE",
    CHANGE_PROBLEM_DESCRIPTION = "CHANGE_PROBLEM_DESCRIPTION",
    CHANGE_INPUT_DESCRIPTION = "CHANGE_INPUT_DESCRIPTION",
    CHANGE_OUTPUT_DESCRIPTION = "CHANGE_OUTPUT_DESCRIPTION",
    CHANGE_POINTS = "CHANGE_POINTS",
    CHANGE_PROBLEM = "CHANGE_PROBLEM",
    CHANGE_TESTCASES = "CHANGE_TESTCASES",
    ADD_TESTCASE = "ADD_TESTCASE",
}

export type ActionType = {
    type: Actions;
    problemTitle?: string;
    problemDescription?: string;
    inputDescription?: string;
    outputDescription?: string;
    points?: number;
    problem?: ProblemType;
    testcase?: {
        testcase: TestcaseType;
        index: number;
    };
};
