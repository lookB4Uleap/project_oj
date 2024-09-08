import { useCallback, useEffect, useState } from "react";
import { Problem, ProblemType } from "./components/Problem";
import { api } from "../../../../api";

// const problems: ProblemType[] = [
//     {
//         _id: 1,
//         problemTitle: 'Problem1',
//         points: 10
//     },
//     {
//         _id: 2,
//         problemTitle: 'Problem2',
//         points: 10
//     },
//     {
//         _id: 3,
//         problemTitle: 'Problem3',
//         points: 10
//     },
//     {
//         _id: 4,
//         problemTitle: 'Problem4',
//         points: 10
//     },
//     {
//         _id: 5,
//         problemTitle: 'Problem5',
//         points: 10
//     },
//     {
//         _id: 6,
//         problemTitle: 'Problem6',
//         points: 10
//     },
//     {
//         _id: 7,
//         problemTitle: 'Problem7',
//         points: 10
//     },
// ];

export const ProblemList = () => {
    const [problems, setProblems] = useState<any>([]);

    const getProblemsList = useCallback(async () => {
        try {
            const {data} = await api.get('api/v1/problems');
            setProblems(() => [...data.problems]);
        }
        catch(error: any) {
            console.log('[Home-Problems] Error');
            console.error(error);
        }
    }, []);

    useEffect(() => {
        getProblemsList();
        () => setProblems([]);
    }, [])

    return (
        <div className="
                flex flex-1 flex-col
                items-center justify-start
                py-5 px-14
            "
        >
            <h1 className="
                    self-start
                    p-5 mb-14
                "
            >
                Problem List
            </h1>
            {
                problems.map((problem: ProblemType, index: number) => 
                    <Problem key={problem._id} problem={problem} index={index} />
                )
            }
        </div>
    );
}