import { useState } from "react";
import Navbar from "../../components/Navbar";
import { Console } from "./components/Console";
import { Editor } from "./components/Editor";
import {
    CodeContext,
    CompilerType,
    languages,
} from "../../contexts/CodeContext";

export const Playground = () => {
    const [compiler, setCompiler] = useState<CompilerType>({
        code: "",
        language: languages[0].id,
        input: "",
        output: "",
    });

    return (
        // TODO: Set language base on query string
        <CodeContext.Provider value={{
            compiler,
            handleCompilerChange: (compiler: CompilerType) => setCompiler((prev: CompilerType) => ({
                ...prev,
                ...compiler
            }))
        }}>
            <div className="flex flex-1 flex-col h-full">
                <Navbar />
                <div className="flex flex-1 flex-col lg:flex-row">
                    <Editor />
                    <Console />
                </div>
            </div>
        </CodeContext.Provider>
    );
};
