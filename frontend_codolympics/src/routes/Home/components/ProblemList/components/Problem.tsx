export type ProblemType = {
    _id: number,
    name: string,
    points: number
}

export const Problem = ({ problem, index }: { problem: ProblemType, index: number}) => {
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
        >
            <div className="
                    flex flex-row
                    text-xl
                "
            >
                {problem.name}
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