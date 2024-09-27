import { ChangeEvent } from "react";

type InputType = {
    title: string;
    type: "text" | "number";
    name: string;
    value: string|number;
    placeholder?: string;
    min?: number;
    max?: number;
    onChange?: (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, prop: string) => void;
}

export const Input = (props: InputType) => {
    // console.log(props.name, typeof props.value);
    return (
        <div className="sm:col-span-4">
            <label
                // htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-200"
            >
                {props.title}
            </label>
            <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                        // id="problem-title"
                        // name="problem-title"
                        type={props.type}
                        placeholder={props?.placeholder}
                        value={props.value}
                        min={props.min}
                        max={props.max}
                        onChange={e => props?.onChange && props.onChange(e, props.name)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-200 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                </div>
                <div className="text-sm">{(typeof props.value === 'string') ? `${props.value.length}/200` : '1-25'}</div>
            </div>
        </div>
    );
};
