import { getCars, updateCar } from "../services/CarsService";
import { getUserReservations, deleteReservation } from "../services/ReservationService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function UserRentals() {
    const [reservations, setReservations] = useState([]);
    const [cars, setCars] = useState([]);

    const token = localStorage.getItem("token");
    let user = null;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            user = {
                id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
                username:
                    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                role:
                    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
            };
        } catch (e) {
            console.error("Invalid token", e);
        }
    }

    const loadData = async () => {
        try {
            const carsResponse = await getCars();
            setCars(carsResponse.data);

            if (user && user.id) {
                const reservationsResponse = await getUserReservations(user.id);
                setReservations(reservationsResponse.data);
            }
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Failed to load rentals. Please try again.");
        }
    };

    const getCarById = (carId) => {
        return cars.find((c) => c.id === carId);
    };

    const handleUnrent = async (reservation) => {
        if (window.confirm("Are you sure you want to cancel this rental?")) {
            try {
                await deleteReservation(reservation.id);

                const car = getCarById(reservation.carId);
                if (car) {
                    const updatedCar = { ...car, isAvailable: true };
                    await updateCar(car.id, updatedCar);
                }

                toast.success("Rental cancelled successfully!");
                loadData();
            } catch (error) {
                console.error("Error cancelling rental:", error);
                toast.error("Failed to cancel rental. Please try again.");
            }
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!user) {
        return (
            <div className="container mt-3 d-flex flex-column justify-content-center align-items-center bg-dark text-light min-vh-100">
                <h2>You must be logged in to view your rentals.</h2>
            </div>
        );
    }

    return (
        <div className="container mt-3 d-flex flex-column justify-content-center align-items-center bg-dark text-light min-vh-100">
            <h2 className="mb-4">My Rentals</h2>

            {reservations.length === 0 ? (
                <p>You have no active rentals.</p>
            ) : (
                <div className="w-75 mt-4 mb-3">
                    <div className="d-flex gap-2 flex-wrap align-items-center justify-content-center">
                        {reservations.map((reservation) => {
                            const car = getCarById(reservation.carId);
                            return (
                                <div className="card" style={{ width: "18rem" }} key={reservation.id}>
                                    {car && (
                                        <img src={car.imagePath} className="card-img-top" alt={`${car.brand} ${car.model}`} />
                                    )}
                                    <div className="card-body">
                                        {car ? (
                                            <h5 className="card-title">{car.brand} {car.model}</h5>
                                        ) : (
                                            <h5 className="card-title">Car #{reservation.carId}</h5>
                                        )}
                                        {car && (
                                            <p className="card-text"><strong>Price/Day:</strong> ${car.pricePerDay}</p>
                                        )}
                                        <p className="card-text">
                                            <strong>Pickup:</strong> {new Date(reservation.pickupDate).toLocaleDateString()}
                                        </p>
                                        <p className="card-text">
                                            <strong>Return:</strong> {new Date(reservation.returnDate).toLocaleDateString()}
                                        </p>
                                        {car && (() => {
                                            const pickup = new Date(reservation.pickupDate);
                                            const returnDate = new Date(reservation.returnDate);
                                            const days = Math.ceil((returnDate - pickup) / (1000 * 60 * 60 * 24));
                                            const total = days * car.pricePerDay;
                                            return (
                                                <p className="card-text"><strong>Total:</strong> ${total.toFixed(2)} ({days} day{days !== 1 ? "s" : ""})</p>
                                            );
                                        })()}
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleUnrent(reservation)}
                                        >
                                            Unrent
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserRentals;