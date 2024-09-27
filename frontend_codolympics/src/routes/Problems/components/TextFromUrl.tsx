import axios from "axios";
import { useEffect, useState } from "react";

export const TextFromUrl = ({url}: {url: string}) => {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        (
            async () => {
                setLoading(true);
                const {data} = await axios.get(url);
                setText(data);
                setLoading(false);
            }
        )();
    }, [])
    
    if (loading)
        return <></>;

    return (
        <code>
            {text}
        </code>
    );
}