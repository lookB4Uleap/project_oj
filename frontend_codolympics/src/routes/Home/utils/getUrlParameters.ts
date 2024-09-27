export const getUrlParameters = (param: string) => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    return searchParams.get(param);
};