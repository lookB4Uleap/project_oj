import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useQuery } from "../hooks/useQuery";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";
import { setUrlParameters } from "../utils/setUrlParameters";
import { api } from "../../../api";
import { Box, Modal, Switch, Typography } from "@mui/material";
import { removeUrlParameters } from "../utils/removeUrlParameters";

type SearchType = {
    sort: number;
    search: string;
    min: number|null;
    max: number|null;
    onChangeSort: (sort: number) => void;
    onChangeSearch: (search: string) => void;
    onChangeMinPoints: (points: number|null) => void;
    onChangeMaxPoints: (points: number|null) => void; 
    onSearch: (problems: []) => void;
};

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const getFilterValue = (min: number|null, max: number|null) => {
    if (!min && !max)
        return "none";
    else if (!max)
        return `${min}-`;
    else if (!min)
        return `-${max}`;   
    return `${min}-${max}`;
}

export const Search = (props: SearchType) => {
    const query = useQuery();
    // const [search, setSearch] = useState<string>("");
    const [modal, setModal] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("none");
    // const filterValue = getFilterValue(props.min, props.max);

    // console.log(filterValue);

    useEffect(() => {
        const filterValue = getFilterValue(props.min, props.max);
        setFilter(filterValue);
    }, [props.max, props.min]);

    // useEffect(() => {
    //     console.log('[Home] Search ', query.get("search"));
    // }, [search])

    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        // e.preventDefault();
        // setSearch(e.target.value);
        props.onChangeSearch(e.target.value);
        query.set("search", e.target.value);
    };

    const handleSubmitSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUrlParameters({ search: props.search });
        const { data } = await api.get("/api/v1/problems", {
            params: {
                search: props.search,
            },
        });
        props.onSearch(data.problems);
    };

    const handleChangeSort = () => {
        props.onChangeSort(props.sort * -1);
        setUrlParameters({ sort: props.sort * -1 });
    };

    // const handleChangeMaxPoints = (e: ChangeEvent<HTMLInputElement>) => {
    //     if (!e.target.value || e.target.value === "")
    //         return
    //     props.onChangeMaxPoints(Number(e.target.value));
    //     setUrlParameters({max: Number(e.target.value)})
    // }

    // const handleChangeMinPoints = (e: ChangeEvent<HTMLInputElement>) => {
    //     if (!e.target.value || e.target.value === "")
    //         return
    //     props.onChangeMinPoints(Number(e.target.value));
    //     setUrlParameters({min: Number(e.target.value)})
    // }

    const handlePointsFilter = (e: ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
        if (e.target.value === "none" || e.target.value === 'filter') {
            props.onChangeMaxPoints(null);
            props.onChangeMinPoints(null);
            removeUrlParameters("max");
            return removeUrlParameters("min");
        }

        const min = e.target.value.split("-")?.[0];
        const max = e.target.value.split("-")?.[1];
        
        if (e.target.value === "51-") {
            removeUrlParameters("max");
            props.onChangeMaxPoints(null);
            props.onChangeMinPoints(Number(min));
            return setUrlParameters({min});
        }

        if (min) {
            setUrlParameters({min});
            props.onChangeMinPoints(Number(min));
        }
        if (max) {
            setUrlParameters({max});
            props.onChangeMaxPoints(Number(max));
        }
    }

    return (
        <form
            className="
                w-full md:w-3/4 lg:w-1/2
                flex
                py-1 mb-6
            "
            onSubmit={handleSubmitSearch}
        >
            <div className="flex flex-1 items-center justify-center flex-wrap">
                <input
                    type="search"
                    className="flex flex-1 text-sm lg:text-base py-2 px-4 rounded-full ring-2 bg-inherit m-1"
                    placeholder="Search"
                    value={props.search}
                    onChange={handleChangeSearch}
                />
                <button
                    className="rounded-full p-2  bg-slate-900 hover:bg-opacity-25 bg-opacity-20 m-1"
                    type="submit"
                >
                    <MagnifyingGlassIcon className="text-white" width={25} />
                </button>
                <button
                    className="rounded-full p-2  bg-slate-900 hover:bg-opacity-25 bg-opacity-20 m-1"
                    type="button"
                    onClick={() => setModal(true)}
                >
                    <AdjustmentsVerticalIcon
                        className="text-white"
                        width={25}
                    />
                </button>
                <Modal
                    open={modal}
                    onClose={() => setModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography
                            id="modal-modal-title"
                            variant="h4"
                            component="h1"
                        >
                            Filters
                        </Typography>
                        <div className="flex flex-1 w-full items-center justify-between mt-5">
                            <div>Ascending</div>
                            <Switch
                                checked={props.sort === 1}
                                onChange={handleChangeSort}
                            />
                        </div>
                        {/* <div className="flex flex-1 flex-col w-full items-center justify-between mt-5">
                            <div className="flex flex-1 flex-col items-start justify-start w-full">
                                <div>Points Range</div>
                                <input
                                    type="number"
                                    name="min-point"
                                    className="ring-1 rounded-md m-1 p-1"
                                    value={props.min ?? -1}
                                    onChange={handleChangeMinPoints}
                                />
                                <input
                                    type="number"
                                    name="max-point"
                                    className="ring-1 rounded-md m-1 p-1"
                                    // value={props.max ?? -1}
                                    // onChange={handleChangeMaxPoints}
                                />
                            </div>
                        </div> */}
                        <div className="flex flex-1 w-full items-center justify-between">
                            {/* <div className="flex flex-1 items-start justify-start w-full"> */}
                                <label htmlFor="points-filter">Points Filter</label>
                                <select 
                                    name="points-filter" 
                                    className="my-3 bg-inherit border-2 border-gray-100 rounded-md p-2"
                                    value={filter}
                                    onChange={handlePointsFilter}
                                >
                                    <option value="filter">Filter</option>
                                    <option value="none">None</option>
                                    <option value="1-10">1 - 10</option>
                                    <option value="11-20">11 - 20</option>
                                    <option value="21-30">21 - 30</option>
                                    <option value="31-40">31 - 40</option>
                                    <option value="41-50">41 - 50</option>
                                    <option value="51-">50 plus</option>
                                </select>
                            {/* </div> */}
                        </div>
                    </Box>
                </Modal>
            </div>
        </form>
    );
};
