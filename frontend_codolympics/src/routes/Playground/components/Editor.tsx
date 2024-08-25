import { useContext } from "react";
import { EditorContainer } from "../../Problems/components/Editor";
import { CodeContext, languageMap } from "../../../contexts/CodeContext";

export const Editor = () => {
    const {compiler} = useContext(CodeContext);
    return <EditorContainer language={languageMap[compiler.language].editor} defaultValue={languageMap[compiler.language].snippet} />;
};
