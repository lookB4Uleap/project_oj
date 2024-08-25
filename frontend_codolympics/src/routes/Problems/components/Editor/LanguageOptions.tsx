import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useContext } from "react";
import { CodeContext, languageMap, languages } from "../../../../contexts/CodeContext";

export const LanguageOptions = () => {
    const {compiler, handleCompilerChange} = useContext(CodeContext);
    const language = languageMap[compiler.language];
    // const [language, setLanguage] = useState(languages[0]);

    const handleLanguageChange = (index: number) => {
        const nextLanguage = languages[index];
        compiler.language = nextLanguage.id;
        handleCompilerChange(compiler);
        // setLanguage(() => ({...nextLanguage}));
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <MenuButton className="inline-flex  justify-center items-center  w-full h-6 gap-x-1.5 rounded-md bg-gray-900 text-sm font-semibold text-gray-300 shadow-sm  hover:bg-gray-950">
                    {language.name}
                    <ChevronDownIcon
                        aria-hidden="true"
                        className="-mr-1 h-5 w-5 text-gray-400"
                    />
                </MenuButton>
            </div>

            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
                <div className="py-1">
                    {languages.map((language, index) => (
                        <MenuItem  key={language.id}>
                            <div
                                className="block px-4 py-2 text-sm text-gray-300 data-[focus]:bg-gray-800 data-[focus]:text-gray-400 hover:cursor-pointer"
                                onClick={() => handleLanguageChange(index)}
                            >
                                {language.name}
                            </div>
                        </MenuItem>
                    ))}
                </div>
            </MenuItems>
        </Menu>
    );
};
