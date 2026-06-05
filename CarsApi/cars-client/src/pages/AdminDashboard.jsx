import { getCars } from "../services/CarsService";
import { getReservations } from "../services/ReservationService";
import { getUsers } from "../services/UsersService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalCars: 0,
        totalReservations: 0,
        totalUsers: 0,
        totalAdmins: 0
    });

    const loadDashboardData = async () => {
        try {
            const carsResponse = await getCars();
            const totalCars = carsResponse.data.length;

            const reservationsResponse = await getReservations();
            const totalReservations = reservationsResponse.data.length;

            const usersResponse = await getUsers();
            const users = usersResponse.data;
            const totalUsers = users.length;

            let totalAdmins = 0;
            for (let i = 0; i < users.length; i++) {
                if (users[i].role && users[i].role.toLowerCase() === "admin") {
                    totalAdmins++;
                }
            }

            setStats({
                totalCars,
                totalReservations,
                totalUsers,
                totalAdmins
            });
        } catch (error) {
            console.error("Error loading dashboard data:", error);
            toast.error("Failed to load dashboard data");
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadDashboardData();
    }, []);

    return (
        <div className="container d-flex flex-column mt-5 align-items-center bg-dark text-light min-vh-100">
            <h2 className="mb-4">Admin Dashboard</h2>

            <div className="row g-4 w-75">
                <div className="col-md-6">
                    <div className="card bg-secondary text-light border-0 shadow h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Cars</h5>
                            <p className="card-text display-4 fw-bold">{stats.totalCars}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card bg-secondary text-light border-0 shadow h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Reservations</h5>
                            <p className="card-text display-4 fw-bold">{stats.totalReservations}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card bg-secondary text-light border-0 shadow h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Users</h5>
                            <p className="card-text display-4 fw-bold">{stats.totalUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card bg-secondary text-light border-0 shadow h-100">
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Admins</h5>
                            <p className="card-text display-4 fw-bold">{stats.totalAdmins}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;