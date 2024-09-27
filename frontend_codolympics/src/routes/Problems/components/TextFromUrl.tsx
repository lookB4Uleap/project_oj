import axios from "axios";
import { useEffect, useState } from "react";

export const TextFromUrl = ({url}: {url: string}) => {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        (
            async () => {
                try {
                setLoading(true);
                const {data} = await axios.get(url);
                console.log(data);
                setText(data);
                setLoading(false);
                }
                catch(error) {
                    console.log(error);
                }
            }
        )();
    }, [])
    
    if (loading)
        return <></>;

    return (
        <textarea className="bg-inherit" disabled value={text}>
        </textarea>
    );
}