import { ChangeEvent } from "react";

type DescriptionType = {
    name: string;
    title: string;
    value: string;
    info?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, prop: string) => void;
};

export const Description = (props: DescriptionType) => {
    return (
        <div className="col-span-full">
            <label
                // htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-200"
            >
                {props.title}
            </label>
            <div className="mt-2">
                <textarea
                    // id="problem-description"
                    // name="problem-description"
                    rows={3}
                    className="block w-full rounded-md bg-inherit border-0 p-1.5 text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={props.value}
                    onChange={e => props?.onChange && props.onChange(e, props.name)}
                />
                <div className="text-sm">{`${props.value.length}/1000`}</div>
            </div>
            {props?.info && (
                <p className="mt-3 text-sm leading-6 text-gray-400">
                    {props.info}
                </p>
            )}
        </div>
    );
};
