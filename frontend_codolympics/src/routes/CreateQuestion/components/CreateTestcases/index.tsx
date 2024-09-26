import { ChangeEvent, useState } from "react";
import { TestcaseType } from "../../types";
import { Testcase } from "./components/Testcase";

type TestcasesType = {
    testcases: TestcaseType[];
    onChange?: (e: ChangeEvent<HTMLInputElement>, index: number, name: string) => void;
    onAddTestcase?: () => void;
};

export const CreateTestcases = (props: TestcasesType) => {
    const [_, setCount] = useState(0);

    return (
        <div className="w-full flex flex-col items-start justify-center pb-28">
            <button className="w-32 max-w-full self-center" type="button" onClick={() => {
                props?.onAddTestcase && props.onAddTestcase();
                setCount(prev => prev + 1);
            }}>Add</button>
            {props.testcases.map((testcase: TestcaseType, index: number) => (
                <Testcase key={index} testcase={testcase} index={index} onChange={props.onChange} />
            ))}
            <button className="w-32 max-w-full self-center" type="button" onClick={() => {
                props?.onAddTestcase && props.onAddTestcase();
                setCount(prev => prev + 1);
            }}>Add</button>
        </div>
    );
};
