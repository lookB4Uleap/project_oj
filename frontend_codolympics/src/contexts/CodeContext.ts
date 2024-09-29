import { createContext } from "react";

export type CompilerType = {
    code: string;
    language: string;
    input: string;
    output: string;
};

export type CodeContextType = {
    compiler: CompilerType;
    handleCompilerChange: (compiler: CompilerType) => void;
};

export type LanguageType = {
    id: string;
    name: string;
    snippet: string;
    editor: string;
}

export type LanguageMapType = {
    [key: string]: LanguageType
}

export const languages: LanguageType[] = [
    { id: "c", name: "C", snippet: "// c editor", editor: "c" },
    { id: "cpp", name: "C++", snippet: "// c++ editor", editor: "cpp" },
    { id: "py", name: "Python3", snippet: "# python editor", editor: "python" },
    {id: "java", name: "Java", snippet: "// java editor", editor: "java"}
];

export const languageMap: LanguageMapType = {
    'c': languages[0],
    'cpp': languages[1],
    'py': languages[2],
    'java': languages[3]
}

export const CodeContext = createContext<CodeContextType>({
    compiler: {
        code: "",
        language: languages[0].id,
        input: "",
        output: "",
    },
    handleCompilerChange: (_: CompilerType) => {}
});
