import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API,
    timeout: 10000
});

export const compilerAPI = axios.create({
    baseURL: import.meta.env.VITE_COMPILER,
    timeout: 30000
})