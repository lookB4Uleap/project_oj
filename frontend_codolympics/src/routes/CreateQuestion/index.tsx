import { ChangeEvent, FormEvent, Reducer, useContext, useReducer } from "react";
import Navbar from "../../components/Navbar";
import { CreateTestcases } from "./components/CreateTestcases";
import { Description } from "./components/Description";
import { Input } from "./components/Input";
import { ProgressBar } from "./components/ProgressBar";
import {
    Actions,
    ActionType,
    ProblemType,
    TestcaseUploadUrlsType,
} from "./types";
import { AuthContext } from "../../contexts/AuthContext";
import { getUploadUrls } from "./utils/get-upload-urls";
import { uploadFiles } from "./utils/upload";
import { createProblem } from "./utils/create-problem";
import { createTestcases } from "./utils/create-testcases";
import { Select } from "./components/Select";

const reducer = (state: ProblemType, action: ActionType): ProblemType => {
    // if (action.type === Actions.CHANGE_PROBLEM_TITLE && action.problemTitle)
    //     return {
    //         ...state,
    //         problemTitle: action.problemTitle,
    //     };

    // if (
    //     action.type === Actions.CHANGE_PROBLEM_DESCRIPTION &&
    //     action.problemDescription
    // )
    //     return {
    //         ...state,
    //         problemDescription: action.problemDescription,
    //     };

    // if (
    //     action.type === Actions.CHANGE_INPUT_DESCRIPTION &&
    //     action.inputDescription
    // )
    //     return {
    //         ...state,
    //         inputDescription: action.inputDescription,
    //     };

    // if (
    //     action.type === Actions.CHANGE_OUTPUT_DESCRIPTION &&
    //     action.outputDescription
    // )
    //     return {
    //         ...state,
    //         outputDescription: action.outputDescription,
    //     };

    // if (action.type === Actions.CHANGE_POINTS && action.points)
    //     return {
    //         ...state,
    //         points: action.points,
    //     };

    if (action.type === Actions.CHANGE_PROBLEM && action?.problem)
        return {
            ...state,
            ...action.problem,
        };

    if (action.type === Actions.CHANGE_TESTCASES && action?.testcase) {
        const index = action.testcase.index;
        const testcase = action.testcase.testcase;
        state.testcases[index] = testcase;
        return state;
    }

    if (action.type === Actions.ADD_TESTCASE && action?.testcase) {
        console.log("[Create-Problem] Add Testcase");
        // state.testcases.push({
        //     inputFile: null,
        //     outputFile: null,
        // });
        // return state;

        const index = action.testcase.index;
        const testcase = action.testcase.testcase;
        state.testcases[index] = testcase;
        return state;
    }

    return state;
};

const defaultProblem: ProblemType = {
    problemTitle: "",
    problemDescription: "",
    tags: "",
    inputDescription: "",
    outputDescription: "",
    points: 5,
    code: "",
    lang: "c",
    testcases: [
        {
            inputFile: null,
            outputFile: null,
            type: "sample",
        },
    ],
};

export const CreateQuestion = () => {
    const [state, dispatch] = useReducer<
        Reducer<ProblemType, ActionType>,
        ProblemType
    >(reducer, defaultProblem, () => defaultProblem);
    const { authToken } = useContext(AuthContext);

    // useEffect(() => {
    //     console.log("[Problem] ", state);
    // }, [state]);

    const handleInputChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
        prop: string
    ) => {
        dispatch({
            type: Actions.CHANGE_PROBLEM,
            problem: {
                ...state,
                [prop]: e.target.value,
            },
        });
    };

    const handleFileSelection = (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
        name: string
    ) => {
        const testcase = {
            ...state.testcases[index],
            [name]: e.target.files?.[0],
        };
        dispatch({
            type: Actions.CHANGE_TESTCASES,
            testcase: {
                testcase,
                index,
            },
        });
    };

    const handleAddTestcase = () => {
        console.log("[Create-Problem] Add Testcase");
        dispatch({
            type: Actions.ADD_TESTCASE,
            testcase: {
                testcase: {
                    inputFile: null,
                    outputFile: null,
                },
                index: state.testcases.length,
            },
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        if (!authToken) return;

        e.preventDefault();
        console.log(state);
        const testcaseUploadUrls: TestcaseUploadUrlsType[] =
            await getUploadUrls(state.testcases, authToken);
        await uploadFiles(state.testcases, testcaseUploadUrls);
        const problem = await createProblem(state, authToken);
        createTestcases(testcaseUploadUrls, problem._id, authToken);
    };

    return (
        <div className="flex flex-1 flex-col h-full items-center justify-center">
            <ProgressBar />
            <Navbar />

            <form
                className="flex flex-1 flex-col items-start justify-center w-2/3 lg:w-1/2 space-y-12 mb-10"
                onSubmit={handleSubmit}
            >
                <h1 className="text-4xl pt-10">Create a Question</h1>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 pt-5 pb-10 w-full">
                    <Input
                        title="Problem Title"
                        type="text"
                        value={state.problemTitle}
                        name="problemTitle"
                        onChange={handleInputChange}
                    />

                    <Description
                        name="problemDescription"
                        title="Problem Description"
                        value={state.problemDescription}
                        info="Please describe the problem in detail"
                        onChange={handleInputChange}
                    />

                    <Description
                        name="tags"
                        title="Problem Tags"
                        value={state.tags}
                        info="Please enter comma separated tags to define the problem"
                        onChange={handleInputChange}
                    />

                    <Description
                        name="inputDescription"
                        title="Input Description"
                        value={state.inputDescription}
                        info="Please describe the input of the problem in detail"
                        onChange={handleInputChange}
                    />

                    <Description
                        name="outputDescription"
                        title="Output Description"
                        value={state.outputDescription}
                        info="Please describe the output of the problem in detail"
                        onChange={handleInputChange}
                    />

                    <Input
                        name="points"
                        title="Points"
                        type="number"
                        value={state.points}
                        min={1}
                        max={50}
                        onChange={handleInputChange}
                    />

                    <Description
                        name="code"
                        title="Solution Code"
                        value={state.code ?? ""}
                        info="Please enter the solution code"
                        onChange={handleInputChange}
                    />

                    <Select
                        name="lang"
                        title= "Language"
                        value={state.lang ?? "c"}
                        onChange={handleInputChange}                        
                    />

                </div>
                <CreateTestcases
                    testcases={state.testcases}
                    onChange={handleFileSelection}
                    onAddTestcase={handleAddTestcase}
                />
                <button
                    className="self-center w-full bg-sky-900 mb-10"
                    type="submit"
                >
                    SUBMIT
                </button>
            </form>
        </div>
    );
};
