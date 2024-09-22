import { ChangeEvent } from "react";
import { TestcaseType } from "../../../types";

type SelectTestcaseType = { 
    testcase: TestcaseType; 
    index: number;
    onChange?: (e: ChangeEvent<HTMLInputElement>, index: number, name: string) => void; 
}

export const Testcase = (props: SelectTestcaseType) => {
    return (
        <div className="flex flex-1 flex-col py-4">
            <h1 className="text-2xl font-bold py-2">
                Testcase #{props.index + 1}
            </h1>
            <div className="flex flex-1 flex-col flex-wrap">
                <div className="py-2 flex flex-1 flex-col">
                    <label htmlFor={`input_${props.index}`}>Input Testcase</label>
                    <input
                        name={`input_${props.index}`}
                        id={`input_${props.index}`}
                        type="file"
                        onChange={e => props?.onChange && props.onChange(e, props.index, 'inputFile')}
                    />
                </div>
                <div className="py-2 flex flex-1 flex-col">
                <label htmlFor={`output_${props.index}`}>Output Testcase</label>
                <input
                    name={`output_${props.index}`}
                    id={`output_${props.index}`}
                    type="file"
                    onChange={e => props?.onChange && props.onChange(e, props.index, 'outputFile')}
                />
                </div>
            </div>
        </div>
    );
};
