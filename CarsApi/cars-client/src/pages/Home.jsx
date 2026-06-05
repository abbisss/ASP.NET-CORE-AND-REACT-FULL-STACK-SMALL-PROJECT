import { getCars, updateCar } from "../services/CarsService";
import { createReservation } from "../services/ReservationService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function Home() {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [dates, setDates] = useState({ PickupDate: "", ReturnDate: "" });

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

    const loadCars = async () => {
        try {
            const response = await getCars();
            setCars(response.data);
        } catch (error) {
            console.error("Error loading cars:", error);
            toast.error("Failed to load cars. Please try again.");
        }
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDates((prev) => ({ ...prev, [name]: value }));
    };

    const handleRentSubmit = async () => {
        if (!dates.PickupDate || !dates.ReturnDate) {
            toast.error("Please select both pickup and return dates.");
            return;
        }

        if (new Date(dates.ReturnDate) <= new Date(dates.PickupDate)) {
            toast.error("Return date must be after pickup date.");
            return;
        }

        try {
            if (!user || !user.username) {
                toast.error("You must be logged in to rent a car.");
                return;
            }

            const reservation = {
                UserId: user.id,
                CarId: selectedCar.id,
                PickupDate: new Date(dates.PickupDate + "T00:00:00").toISOString(),
                ReturnDate: new Date(dates.ReturnDate + "T00:00:00").toISOString()
            };

            await createReservation(reservation);

            const updatedCar = { ...selectedCar, isAvailable: false };
            await updateCar(selectedCar.id, updatedCar);

            setCars(cars.map(c => c.id === selectedCar.id ? { ...c, isAvailable: false } : c));

            toast.success("Car rented successfully!");
            setSelectedCar(null);
            setDates({ PickupDate: "", ReturnDate: "" });
        } catch (error) {
            console.error("Error renting car:", error);
            toast.error("Failed to rent car. Please try again.");
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCars();
    }, []);

    return (
        <div className="container mt-3 d-flex flex-column justify-content-center align-items-center bg-dark text-light min-vh-100">
            <h2 className="mb-4">Available Cars</h2>

            {selectedCar !== null && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
                >
                    <div
                        className="border p-4 rounded bg-secondary text-light"
                        style={{ width: "400px" }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="mb-0">Rent {selectedCar.brand} {selectedCar.model}</h4>
                            <button className="btn btn-sm btn-danger" onClick={() => setSelectedCar(null)}>X</button>
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Pickup Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="PickupDate"
                                value={dates.PickupDate}
                                onChange={handleDateChange}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Return Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="ReturnDate"
                                value={dates.ReturnDate}
                                onChange={handleDateChange}
                            />
                        </div>
                        <button className="btn btn-primary form-control mt-2" onClick={handleRentSubmit}>Confirm Rent</button>
                    </div>
                </div>
            )}

            {cars.length > 0 && (
                <div className="w-75 mt-4 mb-3">
                    <div className="d-flex gap-2 flex-wrap align-items-center justify-content-center">
                        {cars.map((car) => (
                            <div className="card" style={{ width: "18rem" }} key={car.id}>
                                <img src={car.imagePath} className="card-img-top" alt={`${car.brand} ${car.model}`} />
                                <div className="card-body">
                                    <h5 className="card-title">{car.brand} {car.model}</h5>
                                    <p className="card-text"><strong>Year:</strong> {car.year}</p>
                                    <p className="card-text"><strong>Price/Day:</strong> ${car.pricePerDay}</p>
                                    <p className="card-text">
                                        <strong>Status:</strong>{" "}
                                        <span className={car.isAvailable ? "text-success" : "text-danger"}>
                                            {car.isAvailable ? "Available" : "Unavailable"}
                                        </span>
                                    </p>
                                    <button
                                        className="btn btn-primary"
                                        disabled={!car.isAvailable}
                                        onClick={() => setSelectedCar(car)}
                                    >
                                        Rent
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;