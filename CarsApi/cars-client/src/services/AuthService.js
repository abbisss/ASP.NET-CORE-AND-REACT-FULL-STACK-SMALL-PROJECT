import axios from "axios";

const API = axios.create({
    baseURL: "/api"
});

export const AdminLogin = async (user) => {
    return await API.post("/auth/login", user);
};