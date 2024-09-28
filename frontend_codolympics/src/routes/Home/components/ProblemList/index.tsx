import { useCallback, useEffect, useState } from "react";
import { Problem, ProblemType } from "./components/Problem";
import { api } from "../../../../api";
import { Search } from "../Search";
import { getUrlParameters } from "../../utils/getUrlParameters";

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
    // const query = useQuery();
    const [problems, setProblems] = useState<any>([]);
    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState(1);
    const [minPoints, setMinPoints] = useState<number | null>(null);
    const [maxPoints, setMaxPoints] = useState<number | null>(null);

    const getProblemsList = useCallback(async (search?: string | null) => {
        try {
            const { data } = await api.get("api/v1/problems", {
                params: {
                    search,
                },
            });
            setProblems(() => [...data.problems]);
        } catch (error: any) {
            console.log("[Home-Problems] Error");
            console.error(error);
        }
    }, []);

    useEffect(() => {
        const sort = getUrlParameters("sort");
        if (sort && (Number(sort) === -1 || Number(sort) === 1))
            setSort(Number(sort));

        const search = getUrlParameters("search");
        if (search) setSearch(search);
        getProblemsList(search);

        const min = getUrlParameters("min");
        if (min && Number(min) >= 0) 
            setMinPoints(Number(min));

        const max = getUrlParameters("max");
        if (max && Number(max) >= 0) 
            setMaxPoints(Number(max));

        () => setProblems([]);
    }, []);

    // useEffect(() => {
    //     console.log('[ProblemList] ', {maxPoints, minPoints});
    // }, [maxPoints, minPoints]);

    return (
        <div
            className="
                flex flex-1 flex-col
                items-center justify-start
                py-5 px-4 lg:px-14
            "
        >
            <h1
                className="
                    self-start
                    p-2 lg:p-5 mb-3 lg:mb-6
                    text-3xl lg:text-5xl
                "
            >
                Problem List
            </h1>
            <Search
                search={search}
                sort={sort}
                min={minPoints}
                max={maxPoints}
                onChangeSearch={(search) => setSearch(search)}
                onChangeSort={(sort) => setSort(sort)}
                onChangeMinPoints={(points) => setMinPoints(points)}
                onChangeMaxPoints={(points) => setMaxPoints(points)}
                onSearch={(problems) => setProblems([...problems])}
            />
            {problems
                .sort((problem1: ProblemType, problem2: ProblemType) => (problem1.points - problem2.points) * sort)
                .filter((problem: ProblemType) => !minPoints ? true : (problem.points >= minPoints))
                .filter((problem: ProblemType) => !maxPoints ? true : (problem.points <= maxPoints))
                .map((problem: ProblemType, index: number) => (
                    <Problem
                        key={problem._id}
                        problem={problem}
                        index={index}
                    />
                ))}
        </div>
    );
};
