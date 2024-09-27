import { ChangeEvent } from "react";

type SelectType = {
    name: string;
    title: string;
    value: string;
    info?: string;
    onChange?: (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
        prop: string
    ) => void;
};

export const Select = (props: SelectType) => {
    return (
        <div>
            <label
                // htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-200"
            >
                {props.title}
            </label>
            <select
                className="my-3 bg-inherit border-2 border-gray-100 rounded-md p-2"
                name={props.name}
                id={props.name}
                value={props.value}
                onChange={(e) =>
                    props?.onChange && props.onChange(e, props.name)
                }
            >
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="py">Python</option>
            </select>
        </div>
    );
};
