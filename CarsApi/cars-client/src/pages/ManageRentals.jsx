import { useEffect, useState } from "react";
import { getReservations, deleteReservation } from "../services/ReservationService";
import { getCars, updateCar } from "../services/CarsService";
import { getUsers } from "../services/UsersService";
import { toast } from "react-toastify";

function ManageRentals() {
    const [rentals, setRentals] = useState([]);
    const [cars, setCars] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                const rentalsRes = await getReservations();
                setRentals(rentalsRes.data);

                const carsRes = await getCars();
                setCars(carsRes.data);

                const usersRes = await getUsers();
                setUsers(usersRes.data);
            } catch (error) {
                toast.error("Failed to load data " + error.message);
            }
        }
        loadData();
    }, []);

    const getCar = (carId) => cars.find(c => c.id === carId);

    const getUser = (userId) => users.find(u => u.id === userId);

    const calculateTotalPrice = (pickup, returnDate, pricePerDay) => {
        if (!pickup || !returnDate || !pricePerDay) return 0;
        const start = new Date(pickup);
        const end = new Date(returnDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return days * pricePerDay;
    };

    const handleDelete = async (rental) => {
        try {
            await deleteReservation(rental.id);

            const car = getCar(rental.carId);
            if (car) {
                const updatedCar = { ...car, isAvailable: true };
                await updateCar(car.id, updatedCar);

                setCars(prevCars =>
                    prevCars.map(c => (c.id === car.id ? { ...c, isAvailable: true } : c))
                );
            }

            setRentals(prev => prev.filter(r => r.id !== rental.id));
            toast.success("Rental deleted successfully");
        } catch (error) {
            toast.error("Failed to delete rental " + error.message);
        }
    };

    return (
        <div className="container mt-3 d-flex flex-column align-items-center bg-dark text-light min-vh-100">
            <h2 className="mb-4">Manage Rentals</h2>

            {rentals.length === 0 ? (
                <p>No rentals found.</p>
            ) : (
                <div className="w-75 d-flex gap-3 flex-wrap justify-content-center">
                    {rentals.map(rental => {
                        const car = getCar(rental.carId);
                        const user = getUser(rental.userId);
                        return (
                            <div
                                className="card bg-secondary text-light border-light"
                                style={{ width: "18rem" }}
                                key={rental.id}
                            >
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {car ? `${car.brand} ${car.model}` : "Car info missing"}
                                    </h5>
                                    <p className="card-text">
                                        <strong>User:</strong> {user ? user.username : "Unknown"}
                                    </p>
                                    <p className="card-text">
                                        <strong>Pickup Date:</strong> {new Date(rental.pickupDate).toLocaleDateString()}
                                    </p>
                                    <p className="card-text">
                                        <strong>Return Date:</strong> {new Date(rental.returnDate).toLocaleDateString()}
                                    </p>
                                    <p className="card-text">
                                        <strong>Total Price:</strong> $
                                        {calculateTotalPrice(
                                            rental.pickupDate,
                                            rental.returnDate,
                                            car?.pricePerDay
                                        )}
                                    </p>
                                    <button
                                        className="btn btn-danger w-100"
                                        onClick={() => handleDelete(rental)}
                                    >
                                        Delete Rental
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ManageRentals;