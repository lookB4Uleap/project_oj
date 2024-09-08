import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export const LoginButton = () => {
    const navigate = useNavigate();

    return (
        <div className="relative group">
            <button
                type="button"
                // title="Login"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                onClick={() => navigate('/login')}
            >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <ArrowLeftEndOnRectangleIcon className="h-6 w-6" />
            </button>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-sm rounded py-1 px-2 z-10 whitespace-nowrap">
                Login
            </div>
        </div>
    );
};
