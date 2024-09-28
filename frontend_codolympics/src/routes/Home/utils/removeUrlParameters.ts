export const removeUrlParameters = (param: string) => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    // searchParams.set(param, "-1");
    searchParams.delete(param);
    url.search = searchParams.toString();
    window.history.pushState({}, "", url.toString());
};