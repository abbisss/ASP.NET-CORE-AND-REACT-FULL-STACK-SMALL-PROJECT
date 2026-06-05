import axios from "axios";

const API = axios.create({
    baseURL: "/api"
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export const getUsers = async () => {
    return await API.get("/user");
};

export const getUserById = async (id) => {
    return await API.get(`/user/${id}`);
};

export const createUser = async (user) => {
    return await API.post("/user", user);
};

export const deleteUser = async (id) => {
    return await API.delete(`/user/${id}`);
};

export const UserLogin = async (user) => {
    return await API.post(`/user/user-login`, user);
}