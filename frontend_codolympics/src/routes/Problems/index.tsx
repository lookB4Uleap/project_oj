import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { EditorContainer } from "./components/Editor";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
    CodeContext,
    CompilerType,
    languageMap,
    languages,
} from "../../contexts/CodeContext";
import { ProblemType, SubmissionType } from "./types";
import { Problem } from "./components/Problem";
import { Tests } from "./components/Tests";
import { compilerAPI } from "../../api";
import { AuthContext } from "../../contexts/AuthContext";
import { SubmissionModal } from "./components/SubmissionModal";

const getProblem = async (id: string) => {
    // try {
    const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/problems/${id}`
    );

    return data.problem;
    // }
    // catch(error: any) {
    //     console.error("");
    // }
};

export const Problems = () => {
    const { problemId } = useParams();
    const { authToken } = useContext(AuthContext);
    const [problem, setProblem] = useState<ProblemType | null>();
    const [compiler, setCompiler] = useState<CompilerType>({
        code: "",
        language: languages[0].id,
        input: "",
        output: "",
    });
    const [submission, setSubmission] = useState<SubmissionType | null>(null);

    useEffect(() => {
        // console.log('[Problems] Problem Id ', problemId);
        (async () => {
            if (!problemId) return;
            const problem = await getProblem(problemId);
            setProblem(() => ({ ...problem }));
        })();
    }, []);

    const handleModalClose = () =>
        setSubmission(
            (prev: SubmissionType | null) =>
                prev && {
                    ...prev,
                    open: false,
                }
        );

    const handleSubmit = async () => {
        const response = await compilerAPI.post(
            `/api/v1/submit/${problemId}`,
            {
                code: compiler.code,
                language: compiler.language,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        // console.log("[Problem] Submmit", response.data);
        // alert(
        //     JSON.stringify({
        //         message: response.data.message,
        //         tests: response.data.submission.tests,
        //         passed: response.data.submission.passed,
        //     })
        // );
        setSubmission(() => ({
            userId: response.data.submission.userId,
            tests: response.data.submission.tests,
            passed: response.data.submission.passed,
            problemId: response.data.submission.problemId,
            points: response.data.submission.points,
            verdict: response.data.submission.verdict,
            open: true,
        }));
    };

    // useEffect(() => {
    //     console.log('[Problem] Problem ', problem);
    // }, [problem]);

    return (
        <CodeContext.Provider
            value={{
                compiler,
                handleCompilerChange: (compiler: CompilerType) =>
                    setCompiler((prev: CompilerType) => ({
                        ...prev,
                        ...compiler,
                    })),
            }}
        >
            <div className="flex flex-1 flex-col h-full">
                <SubmissionModal submission={submission} onClose={handleModalClose}  />
                <Navbar />
                <div className="flex flex-1 flex-col lg:flex-row">
                    <div className="flex flex-1 flex-col h-full resize-x">
                        <Problem problem={problem} />
                        <Tests />
                    </div>
                    <div className="flex flex-1 h-full">
                        <EditorContainer
                            // language="cpp"
                            // defaultValue="// c++ editor"
                            language={languageMap[compiler.language].editor}
                            defaultValue={
                                languageMap[compiler.language].snippet
                            }
                            submit
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </CodeContext.Provider>
    );
};
