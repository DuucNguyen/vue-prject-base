import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL_LOCAL;

const instance = axios.create({
    baseURL,
    timeout: 300000,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
    responseType: "json",
});

export default instance;
