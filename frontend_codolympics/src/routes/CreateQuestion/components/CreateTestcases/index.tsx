import { ChangeEvent } from "react";
import { TestcaseType } from "../../types";
import { Testcase } from "./components/Testcase";

type TestcasesType = {
    testcases: TestcaseType[];
    onChange?: (e: ChangeEvent<HTMLInputElement>, index: number, name: string) => void;
};

export const CreateTestcases = (props: TestcasesType) => {
    return (
        <div className="w-full flex flex-col items-start justify-center pb-28">
            <button className="w-32 max-w-full self-center">Add</button>
            {props.testcases.map((testcase: TestcaseType, index: number) => (
                <Testcase key={index} testcase={testcase} index={index} onChange={props.onChange} />
            ))}
            <button className="w-32 max-w-full self-center">Add</button>
        </div>
    );
};
