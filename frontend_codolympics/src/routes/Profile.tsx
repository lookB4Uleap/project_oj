import { useContext } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const { user } = useContext(AuthContext);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (!user) {
    //         alert("Login to view page");
    //         return navigate('/');
    //     }
    // }, [authToken]);

    return (
        <div className="flex flex-1 flex-col h-full items-center justify-center">
            <Navbar />

            <div className="flex flex-1 flex-col w-full items-center justify-start lg:w-2/3 mt-32 px-5 lg:px-20">
                <h1
                    className="
                    md:self-center lg:self-start 
                    p-2 lg:p-5 mb-3 lg:mb-6
                    text-3xl lg:text-5xl
                "
                >
                    Profile
                </h1>
                {user && (
                    <div className="flex flex-col lg:self-start w-full">
                        <label className="py-5" htmlFor="username">
                            Username: {}
                        </label>
                        <input
                            className="max-w-full w-3/5 min-w-fit p-2 rounded-md"
                            type="text"
                            name="username"
                            disabled
                            value={user?.username}
                        />
                        <label className="py-5" htmlFor="email">
                            Email:
                        </label>
                        <input
                            className="max-w-full w-3/5 min-w-fit p-2 rounded-md"
                            type="text"
                            name="email"
                            disabled
                            value={user?.email}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
