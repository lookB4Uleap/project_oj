import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../api";

type UserType = {
    _id: string;
    username: string;
    email: string;
    points?: number;
}

export const Leaderboard = () => {
    const [users, setUsers] = useState<UserType[]>([]);

    useEffect(() => {
        (
            async () => {
                const {data} = await api.get("/api/v1/users");
                if (data) 
                    setUsers(() => [...data]);
            }
        )();
    }, []);

    return (
        <div className="flex flex-1 flex-col h-full items-center justify-center">
            <Navbar />
            <div className="flex flex-1 flex-col w-full md:w-1/2 lg:w-2/3  py-10 px-5">
                <h1 className="text-2xl lg:text-5xl md:text-4xl my-4">
                    Leaderboard
                </h1>
                {
                    users && users.map((user, index) => 
                        <div key={user._id} 
                            className={`
                                flex flex-col 
                                p-5 my-2 
                                border-2 border-transparent
                                rounded-md
                                hover:border-gray-600
                                hover:cursor-pointer 
                                ${index % 2 === 0 ? "bg-opacity-20 bg-slate-900" : "bg-opacity-25 bg-slate-800"}
                            `}
                        >
                            <h2 className="text-base lg:text-2xl md:text-xl">{index+1}. {user.username}</h2>
                            <div>Points: {user.points}</div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};
