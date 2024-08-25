import { Editor } from "@monaco-editor/react";
import { LanguageOptions } from "./LanguageOptions";
import { useContext } from "react";
import { CodeContext } from "../../../../contexts/CodeContext";
import { compilerAPI } from "../../../../api";

type EditorProps = {
    language: string;
    defaultValue?: string;
    run?: boolean;
    submit?: boolean;
};

const options = {
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: "on",
    accessibilitySupport: "auto",
    autoIndent: false,
    automaticLayout: true,
    codeLens: true,
    colorDecorators: true,
    contextmenu: true,
    cursorBlinking: "blink",
    cursorSmoothCaretAnimation: false,
    cursorStyle: "line",
    disableLayerHinting: false,
    disableMonospaceOptimizations: false,
    dragAndDrop: false,
    fixedOverflowWidgets: false,
    folding: true,
    foldingStrategy: "auto",
    fontLigatures: false,
    formatOnPaste: false,
    formatOnType: false,
    hideCursorInOverviewRuler: false,
    highlightActiveIndentGuide: true,
    links: true,
    mouseWheelZoom: false,
    multiCursorMergeOverlapping: true,
    multiCursorModifier: "alt",
    overviewRulerBorder: true,
    overviewRulerLanes: 2,
    quickSuggestions: true,
    quickSuggestionsDelay: 100,
    readOnly: false,
    renderControlCharacters: false,
    renderFinalNewline: true,
    renderIndentGuides: true,
    renderLineHighlight: "all",
    renderWhitespace: "none",
    revealHorizontalRightPadding: 30,
    roundedSelection: true,
    rulers: [],
    scrollBeyondLastColumn: 5,
    scrollBeyondLastLine: true,
    selectOnLineNumbers: true,
    selectionClipboard: true,
    selectionHighlight: true,
    showFoldingControls: "mouseover",
    smoothScrolling: false,
    suggestOnTriggerCharacters: true,
    wordBasedSuggestions: true,
    wordSeparators: "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
    wordWrap: "off",
    wordWrapBreakAfterCharacters: "\t})]?|&,;",
    wordWrapBreakBeforeCharacters: "{([+",
    wordWrapBreakObtrusiveCharacters: ".",
    wordWrapColumn: 80,
    wordWrapMinified: true,
    wrappingIndent: "none",
};

export const EditorContainer = (props: EditorProps) => {
    const { compiler, handleCompilerChange } = useContext(CodeContext);

    const handleEdit = (code: string) => {
        // console.log('[Code]', code);
        compiler.code = code;
        handleCompilerChange(compiler);
    };

    const handleRun = async () => {
        console.log("[Code] Run ", compiler);
        try {
            const { data } = await compilerAPI.post("/api/v1/run", {
                language: compiler.language,
                code: compiler.code,
                input: compiler.input,
            });
            console.log('[Code] Output', data);
            compiler.output = data.result;
            handleCompilerChange(compiler);
        } catch (error: any) {
            console.log("[Code] Error");
            console.error(error);
        }
    };

    return (
        <div className="flex flex-1 flex-col h-full">
            <div className="flex flex-row justify-end">
                <div className="flex flex-row justify-center items-center">
                    <button
                        className="flex items-center justify-center text-sm h-6 m-1 rounded-md"
                        onClick={handleRun}
                    >
                        Run
                    </button>

                    {props.submit && (
                        <button className="flex items-center justify-center text-sm h-6 m-1 rounded-md">
                            Submit
                        </button>
                    )}
                </div>
                <div className="flex flex-1 justify-end items-center">
                    <LanguageOptions />
                </div>
            </div>
            <Editor
                className="h-full"
                language={props.language}
                value={props.defaultValue}
                theme="vs-dark"
                options={options}
                onChange={(code?: string) => code && handleEdit(code)}
            />
        </div>
    );
};
