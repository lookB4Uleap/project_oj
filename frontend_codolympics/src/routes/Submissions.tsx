import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

type SubmissionType = {
    userId: string;
    problemId: string;
    passed: number;
    tests: number;
    points: number;
    verdict: "Passed" | "Failed";
    problemTitle: string;
    [key: string]: any;
}

export const Submissions = () => {
    const { authToken } = useContext(AuthContext);
    const [submissions, setSubmissions] = useState<SubmissionType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // TODO: Add try catch block
        (async () => {
            if(!authToken)
                return;
            const { data } = await api.get("/api/v1/submissions", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            // console.log('[Submission] ', data);
            setSubmissions(() => [...data]);
        })();
    }, [authToken]);

    return (
        <div className="flex flex-1 flex-col h-full items-center justify-center">
            <Navbar />
            <div className="flex flex-1 flex-col w-full md:w-1/2 lg:w-2/3  py-10 px-5">
                <h1 className="text-2xl lg:text-5xl md:text-4xl my-4">Submissions</h1>
                {
                    submissions && submissions.map((submission, index) => 
                        <div key={submission._id} 
                            className={`
                                flex flex-col 
                                p-5 my-2 
                                border-2 border-transparent
                                hover:border-gray-600
                                hover:cursor-pointer 
                                ${index % 2 === 0 ? "bg-opacity-20 bg-slate-900" : "bg-opacity-25 bg-slate-800"}
                            `}
                            onClick={() => navigate(`/problems/${submission.problemId}`)}
                        >
                            <h2 className="text-xl lg:text-3xl md:text-2xl">{submission.problemTitle}</h2>
                            <div>Testcases {submission.passed}/{submission.tests} passed</div>
                            <div className="italic">Score: {submission.points}</div>
                            <div>Latest Verdict: {submission.verdict}</div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};
