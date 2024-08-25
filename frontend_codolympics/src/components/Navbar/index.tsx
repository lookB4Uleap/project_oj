import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import {
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { MenuOptions } from "./Menu";
import { LoginButton } from "./LoginButton";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";

type PathIndexType = {
    [key: string]: number;
};

const navigationProps = [
    { name: "Home", href: "/", current: false },
    { name: "Playground", href: "/playground", current: false },
];

const pathIndex: PathIndexType = {
    "/": 0,
    "/playground": 1,
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
    const [navigation, setNavigation] = useState(navigationProps);
    const { authToken } = useContext(AuthContext);

    const handleChange = (index: number) => {
        navigation[index].current = true;
        setNavigation([...navigation]);
    };

    useEffect(() => {
        const pathName = window.location.pathname;
        let index = -1;
        if (pathName in pathIndex)
            index = pathIndex[pathName];
        if (index !== -1)
            handleChange(index);
        () => setNavigation(navigationProps);
    }, []);

    return (
        <Disclosure as="nav" className="bg-gray-800 w-full">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon
                                aria-hidden="true"
                                className="block h-6 w-6 group-data-[open]:hidden"
                            />
                            <XMarkIcon
                                aria-hidden="true"
                                className="hidden h-6 w-6 group-data-[open]:block"
                            />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <img
                                alt="Your Company"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                className="h-8 w-auto"
                            />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item, index) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        aria-current={
                                            item.current ? "page" : undefined
                                        }
                                        className={classNames(
                                            item.current
                                                ? "bg-gray-900 text-white"
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                            "rounded-md px-3 py-2 text-sm font-medium"
                                        )}
                                        onClick={() => handleChange(index)}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* Bell Icon */}
                        {/* <button
                            type="button"
                            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <BellIcon aria-hidden="true" className="h-6 w-6" />
                        </button> */}

                        {/* Profile dropdown */}
                        {/* <ArrowLeftEndOnRectangleIcon className="h-6 w-6" /> */}
                        {authToken ? <MenuOptions /> : <LoginButton />}
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? "page" : undefined}
                            className={classNames(
                                item.current
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "block rounded-md px-3 py-2 text-base font-medium"
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}