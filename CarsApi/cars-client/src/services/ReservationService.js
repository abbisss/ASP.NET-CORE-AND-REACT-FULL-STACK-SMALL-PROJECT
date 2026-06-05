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

export const getReservations = async () => {
    return await API.get("/reservation");
};

export const getUserReservations = async (id) => {
    return await API.get(`/reservation/${id}`);
};

export const createReservation = async (reservation) => {
    return await API.post("/reservation", reservation);
};

export const updateReservation = async (id, reservation) => {
    return await API.put(`/reservation/${id}`, reservation);
};

export const deleteReservation = async (id) => {
    return await API.delete(`/reservation/${id}`);
};