import { useState } from "react";
import { TestCases } from "./TestCases";

export const Tests = () => {
    const [open, setOpen] = useState(false);
    // const { compiler, handleCompilerChange } = useContext(CodeContext);

    // const handleRunInput = async () => {
    //     if(!compiler.input || compiler.input === "" || !problemId)
    //         return;

    //     const {data} = await compilerAPI.post(`/api/v1/run/${problemId}`, { input: compiler.input });

    //     handleCompilerChange({
    //         ...compiler,
    //         output: data.result
    //     });
    // };

    return (
        // TODO: May need to make text box area sticky, i.e position absolute
        <div
            // className="flex flex-col
            //             items-start justify-start
            //             self-end justify-self-end
            //             h-40 w-full
            //             px-5
            //             hover:cursor-pointer
            //         "
            className="
                flex flex-col
                items-start justify-start
                bg-slate-900
                fixed
                bottom-0
                w-1/2
                px-5
                z-10
                hover:cursor-pointer
                py-5
                rounded-t-lg
            "
        >
            <h2
                className="text-xl font-bold mb-2 w-full"
                onClick={() => setOpen(!open)}
            >
                Run Test Case
            </h2>   
            {/* {open && (
                <button
                    type="button"
                    className="bg-inherit border-2 border-gray-200 p-2 text-sm"
                    onClick={handleRunInput}
                >
                    Check Output
                </button>
            )} */}
            {open && <TestCases />}
        </div>
    );
};
