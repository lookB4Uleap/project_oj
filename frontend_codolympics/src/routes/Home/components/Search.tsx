import { ChangeEvent, FormEvent, useState } from "react";
import { useQuery } from "../hooks/useQuery";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";
import { setUrlParameters } from "../utils/setUrlParameters";
import { api } from "../../../api";
import { Box, Modal, Switch, Typography } from "@mui/material";

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

export const Search = (props: SearchType) => {
    const query = useQuery();
    // const [search, setSearch] = useState<string>("");
    const [modal, setModal] = useState<boolean>(false);

    // useEffect(() => {
    //     setSearch(query.get("search") ?? "");
    // }, []);

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
                            variant="h6"
                            component="h2"
                        >
                            Filters
                        </Typography>
                        <div className="flex flex-1 w-full items-center justify-between">
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
                    </Box>
                </Modal>
            </div>
        </form>
    );
};
