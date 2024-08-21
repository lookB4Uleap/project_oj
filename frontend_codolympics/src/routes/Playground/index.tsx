import Navbar from "../../components/Navbar";
import { EditorContainer } from "../Problems/components/Editor";

export const Playground = () => {
    return (
        <div className="flex flex-1 flex-col h-full">
            <Navbar />
            <div className="flex flex-1 flex-col lg:flex-row">
                {/* <div className="flex flex-1 h-full resize-x"></div> */}
                <div className="flex flex-1 h-full">
                    <EditorContainer language="cpp" defaultValue="// c++ editor" />
                </div>
            </div>
        </div>
    );
};