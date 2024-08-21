import { Problem, ProblemType } from "./components/Problem";

const problems: ProblemType[] = [
    {
        _id: 1,
        name: 'Problem1',
        points: 10
    },
    {
        _id: 2,
        name: 'Problem2',
        points: 10
    },
    {
        _id: 3,
        name: 'Problem3',
        points: 10
    },
    {
        _id: 4,
        name: 'Problem4',
        points: 10
    },
    {
        _id: 5,
        name: 'Problem5',
        points: 10
    },
    {
        _id: 6,
        name: 'Problem6',
        points: 10
    },
    {
        _id: 7,
        name: 'Problem7',
        points: 10
    },
];

export const ProblemList = () => {
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