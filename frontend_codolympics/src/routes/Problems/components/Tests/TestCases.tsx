import { Textarea } from "@headlessui/react";
import { ChangeEvent, useContext } from "react";
import { CodeContext } from "../../../../contexts/CodeContext";

export const TestCases = () => {
    const { compiler, handleCompilerChange } = useContext(CodeContext);

    const handleInput = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        compiler.input = e.target.value;
        handleCompilerChange(compiler);
    };

    return (
        <>
            <Textarea
                className="
                    bg-inherit h-20
                    resize-y 
                    w-full
                    border-2 border-gray-700 rounded-md 
                    m-2 p-1 opacity-70
                    text-sm
                "
                value={compiler.input}
                onChange={handleInput}
            />
            <Textarea
                className="
                    bg-inherit h-40
                    resize-y 
                    w-full
                    border-2 border-gray-700 rounded-md 
                    m-2 p-1 opacity-70
                    text-sm
                "
                value={compiler.output}
                disabled
            />
        </>
    );
};
