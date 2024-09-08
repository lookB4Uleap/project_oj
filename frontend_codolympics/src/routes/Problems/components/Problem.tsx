import { ProblemType } from "../types";

export const Problem = ({problem}: {problem?: ProblemType| null}) => {
    return (
        <div className="overflow-scroll flex flex-1 flex-col items-start justify-start px-5 py-2">
            {/* 
            {JSON.stringify(problem, null, "\t")} */}
            <div className="my-6">
                <h1 className="text-3xl font-bold mb-1">{problem?.problemTitle}</h1>
                <div className="text-sm italic font-semibold">Points: {problem?.points}</div>
            </div>

            <div className="text-base mb-6">{problem?.problemDescription}</div>
            
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">Input</h2>
                <div>{problem?.inputDescription}</div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-3">Output</h2>
                <div>{problem?.outputDescription}</div>
            </div>
        </div>
    );
}