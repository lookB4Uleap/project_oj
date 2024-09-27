export const setUrlParameters = (params: { [key: string]: any }) => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);

    for (const [key, value] of Object.entries(params)) {
        searchParams.set(key, value);
    }

    url.search = searchParams.toString();
    window.history.pushState({}, "", url.toString());
};