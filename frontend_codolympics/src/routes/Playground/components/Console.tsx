import { Textarea } from "@headlessui/react";
import { ChangeEvent, useContext } from "react";
import { CodeContext } from "../../../contexts/CodeContext";

export const Console = () => {
    const {compiler, handleCompilerChange} = useContext(CodeContext);

    const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        compiler.input = e.target.value;
        handleCompilerChange(compiler);
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col">
                <h4
                    className="
                        flex 
                        items-center justify-start 
                        font-bold
                        pl-5 h-8
                    "
                >
                    Input
                </h4>
                <Textarea 
                    className="
                        bg-inherit h-full 
                        resize-none 
                        border-2 border-gray-700 rounded-md 
                        m-2 p-1 opacity-70
                        text-sm
                    "
                    value={compiler.input}
                    onChange={handleInput}
                 />
            </div>
            <div className="flex flex-1 flex-col">
                <h4
                    className="
                        flex 
                        items-center justify-start 
                        font-bold
                        pl-5 h-8
                    "
                >
                    Output
                </h4>
                <Textarea 
                    className="
                        bg-inherit h-full 
                        resize-none 
                        border-2 border-gray-700 rounded-md 
                        m-2 p-1 opacity-70
                        text-sm
                    "
                    disabled
                    value={compiler.output}
                 />
            </div>
        </div>
    );
};
