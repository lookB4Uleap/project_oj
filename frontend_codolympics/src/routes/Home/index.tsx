import { useContext, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { ProblemList } from "./components/ProblemList";
import { AuthContext } from "../../contexts/AuthContext";


const Home = () => {
    const { authToken } = useContext(AuthContext);

    useEffect(() => {
        console.log('[Home] Auth Token ', authToken);
    }, [authToken])
    

    return (
        <div className="flex flex-1 flex-col h-full">
            <Navbar />
            <div className="flex flex-1">
                <ProblemList />
            </div>
        </div>
        
    )
};

export default Home;
