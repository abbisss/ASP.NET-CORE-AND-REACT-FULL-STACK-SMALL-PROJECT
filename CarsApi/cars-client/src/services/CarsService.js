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

export const getCars = async () => {
    return await API.get("/car");
};

export const getCarById = async (id) => {
    return await API.get(`/car/${id}`);
};

export const createCar = async (car) => {
    return await API.post("/car", car);
};

export const updateCar = async (id, car) => {
    return await API.put(`/car/${id}`, car);
};

export const deleteCar = async (id) => {
    return await API.delete(`/car/${id}`);
};