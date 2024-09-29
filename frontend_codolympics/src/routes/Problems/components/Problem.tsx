import { Textarea } from "@headlessui/react";
import { ProblemType } from "../types";
import { TextFromUrl } from "./TextFromUrl";
import { ChangeEvent, useState } from "react";
import { compilerAPI } from "../../../api";
import axios from "axios";

export const Problem = ({ problem }: { problem?: ProblemType | null }) => {
    const [output, setOutput] = useState<string>("");

    const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setOutput(e.target.value);
    }

    const handleCheckOutput = async () => {
        if (!output || output === "" || !problem?.visibleTestcases || problem.visibleTestcases.length === 0)
            return;

        const {data: input} = await axios.get(problem.visibleTestcases[0].input);
        const {data} = await compilerAPI.post(`/api/v1/run/${problem?._id}`, { input });

        if (output.replace(/(\r\n|\n|\r)/gm, "") === data.result.replace(/(\r\n|\n|\r)/gm, ""))
            alert('Correct output predicted');
        else
            alert('Output predicted is not correct');

        // console.log('[Problem] Output', output, data.result.replace(/(\r\n|\n|\r)/gm, ""));
    }

    return (
        <div className="overflow-scroll flex flex-1 flex-col items-start justify-start px-5 py-2 mb-32 w-full">
            {/* 
            {JSON.stringify(problem, null, "\t")} */}
            <div className="my-6">
                <h1 className="text-3xl font-bold mb-1">
                    {problem?.problemTitle}
                </h1>
                <div className="text-sm italic font-semibold">
                    Points: {problem?.points}
                </div>
            </div>

            <div className="text-base mb-6">{problem?.problemDescription}</div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">Input</h2>
                <div>{problem?.inputDescription}</div>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">Output</h2>
                <div>{problem?.outputDescription}</div>
            </div>

            {problem?.sampleTestcases?.map((sampleTestcase, index) => (
                <div className="w-full" key={sampleTestcase._id}>
                    <div className="mb-6 w-full">
                        <h2 className="text-2xl font-semibold mb-3">
                            Sample Input #{index + 1}
                        </h2>
                        <div className="bg-opacity-20 bg-slate-900 w-full rounded-md p-3">
                            <TextFromUrl url={sampleTestcase.input} />
                        </div>
                    </div>
                    <div className="mb-6 w-full">
                        <h2 className="text-2xl font-semibold mb-3">
                            Sample Output #{index + 1}
                        </h2>
                        <div className="bg-opacity-20 bg-slate-900 w-full rounded-md p-3">
                            <TextFromUrl url={sampleTestcase.output} />
                        </div>
                    </div>
                </div>
            ))}

            {problem?.visibleTestcases &&
                problem.visibleTestcases.length > 0 && (
                    <div className="mb-6 w-full">
                        <h2 className="text-2xl font-semibold mb-3">
                            Know The Problem
                        </h2>
                        <h4 className="text-base mb-3">Test Your Problem Understanding By Answering The Output To The Following Input</h4>
                        <div className="bg-opacity-20 bg-slate-900 w-full rounded-md p-3 mb-1">
                            <TextFromUrl url={problem.visibleTestcases[0].input} />
                        </div>
                        <h4 className="text-base mb-1">Enter your expected answer</h4>
                        <div className="w-full rounded-md mb-1">
                            <Textarea 
                                className="w-full bg-inherit rounded-md ring-1 ring-inset ring-gray-300 p-2 resize-y min-h-10"
                                value={output}
                                onChange={handleTextChange}
                            />
                        </div>
                        <button type="button" onClick={handleCheckOutput}>Check Output</button>
                    </div>
                )}
        </div>
    );
};
