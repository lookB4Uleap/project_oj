import { useNavigate } from "react-router-dom";

export type ProblemType = {
    _id: number,
    problemTitle: string,
    points: number
}

export const Problem = ({ problem, index }: { problem: ProblemType, index: number}) => {
    const navigate = useNavigate();

    return (
        <div className={`
                flex flex-row flex-wrap 
                justify-between 
                w-full my-1 py-2 px-5 border-2 border-transparent
                rounded-md
                hover:border-gray-600
                hover:cursor-pointer
                ${index % 2 === 0 ? "bg-opacity-20 bg-slate-900" : "bg-opacity-25 bg-slate-800"}
            `}
            onClick={() => navigate(`/problems/${problem._id}`)}
        >
            <div className="
                    flex flex-row
                    text-xl
                "
            >
                {problem.problemTitle}
            </div>
            <div
                className="
                    flex flex-row
                    text-sm italic
                "
            >
                Points: {problem.points}
            </div>
        </div>
    );
}