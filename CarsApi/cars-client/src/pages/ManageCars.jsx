import { getCars, createCar, updateCar, deleteCar } from "../services/CarsService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ManageCars() {
    const [formCar, setFormCar] = useState({
        Brand: "",
        Model: "",
        Year: 2000,
        PricePerDay: 0,
        ImagePath: "",
        IsAvailable: true
    });

    const [editFormCar, setEditFormCar] = useState({
        Brand: "",
        Model: "",
        Year: 2000,
        PricePerDay: 0,
        ImagePath: "",
        IsAvailable: true
    });

    const [cars, setCars] = useState([]);
    const [editingCarId, setEditingCarId] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let parsed = value;
        if (name === "Year") parsed = parseInt(value);
        if (name === "PricePerDay") parsed = parseFloat(value);
        setFormCar((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : parsed }));
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        let parsed = value;
        if (name === "Year") parsed = parseInt(value);
        if (name === "PricePerDay") parsed = parseFloat(value);
        setEditFormCar((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : parsed }));
    };

    const resetForm = () => {
        setFormCar({
            Brand: "",
            Model: "",
            Year: 2000,
            PricePerDay: 0,
            ImagePath: "",
            IsAvailable: true
        });
        setEditingCarId(null);
    };

    const validateForm = (data) => {
        if (
            data.Brand.trim() === "" ||
            data.Model.trim() === "" ||
            data.Year <= 1990 ||
            data.Year > new Date().getFullYear() ||
            data.PricePerDay < 2
        ) {
            toast.error("Please fill in all fields with valid values.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm(formCar)) return;

        try {
            await createCar(formCar);
            toast.success("Car created successfully!");
            loadCars();
            resetForm();
        } catch (error) {
            console.error("Error creating car:", error);
            toast.error("Failed to create car. Please try again.");
        }
    };

    const handleUpdate = async (id) => {
        if (!validateForm(editFormCar)) return;

        try {
            await updateCar(id, editFormCar);
            toast.success("Car updated successfully!");
            loadCars();
            setEditingCarId(null);
        } catch (error) {
            console.error("Error updating car:", error);
            toast.error("Failed to update car. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this car?")) {
            try {
                await deleteCar(id);
                toast.success("Car deleted successfully!");
                loadCars();
            } catch (error) {
                console.error("Error deleting car:", error);
                toast.error("Failed to delete car. Please try again.");
            }
        }
    };

    const startEdit = (car) => {
        setEditFormCar({
            Id: car.id,
            Brand: car.brand,
            Model: car.model,
            Year: car.year,
            PricePerDay: car.pricePerDay,
            ImagePath: car.imagePath,
            IsAvailable: car.isAvailable
        });
        setEditingCarId(car.id);
    };

    const loadCars = async () => {
        try {
            const response = await getCars();
            setCars(response.data);
        } catch (error) {
            console.error("Error loading cars:", error);
            toast.error("Failed to load cars. Please try again.");
        }
    };

    useEffect(() => {
        loadCars();
    }, []);

    return (
        <div className="container mt-3 d-flex flex-column justify-content-center align-items-center bg-dark text-light min-vh-100">
            <h2 className="mb-4">Manage Cars (Create View And Delete)</h2>

            <form onSubmit={handleSubmit} className="w-50 border p-4 rounded bg-secondary">
                <h4>Add New Car</h4>
                <div className="mb-2">
                    <label className="form-label">Brand</label>
                    <input type="text" className="form-control" name="Brand" value={formCar.Brand} onChange={handleChange} />
                </div>
                <div className="mb-2">
                    <label className="form-label">Model</label>
                    <input type="text" className="form-control" name="Model" value={formCar.Model} onChange={handleChange} />
                </div>
                <div className="mb-2">
                    <label className="form-label">Year</label>
                    <input type="number" className="form-control" name="Year" value={formCar.Year} onChange={handleChange} />
                </div>
                <div className="mb-2">
                    <label className="form-label">Price Per Day</label>
                    <input type="number" className="form-control" name="PricePerDay" value={formCar.PricePerDay} onChange={handleChange} />
                </div>
                <div className="mb-2">
                    <label className="form-label">Image Path</label>
                    <input type="text" className="form-control" name="ImagePath" value={formCar.ImagePath} onChange={handleChange} />
                </div>
                <div className="mb-2 form-check">
                    <label className="form-label">Available</label>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="IsAvailable"
                        checked={formCar.IsAvailable}
                        onChange={(e) => setFormCar((prev) => ({ ...prev, [e.target.name]: e.target.checked }))}
                    />
                </div>
                <button type="submit" className="btn btn-primary form-control mb-2">Submit</button>
            </form>

            {editingCarId !== null && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
                >
                    <div
                        className="border p-4 rounded bg-secondary text-light"
                        style={{ width: "400px" }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="mb-0">Edit Car</h4>
                            <button className="btn btn-sm btn-danger" onClick={() => setEditingCarId(null)}>X</button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(editingCarId); }}>
                            <div className="mb-2">
                                <label className="form-label">Brand</label>
                                <input type="text" className="form-control" name="Brand" value={editFormCar.Brand} onChange={handleEditChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Model</label>
                                <input type="text" className="form-control" name="Model" value={editFormCar.Model} onChange={handleEditChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Year</label>
                                <input type="number" className="form-control" name="Year" value={editFormCar.Year} onChange={handleEditChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Price Per Day</label>
                                <input type="number" className="form-control" name="PricePerDay" value={editFormCar.PricePerDay} onChange={handleEditChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Image Path</label>
                                <input type="text" className="form-control" name="ImagePath" value={editFormCar.ImagePath} onChange={handleEditChange} />
                            </div>
                            <div className="mb-2 form-check">
                                <label className="form-label">Available</label>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="IsAvailable"
                                    checked={editFormCar.IsAvailable}
                                    onChange={(e) => setEditFormCar((prev) => ({ ...prev, [e.target.name]: e.target.checked }))}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary form-control mb-2">Submit</button>
                        </form>
                    </div>
                </div>
            )}

            {cars.length > 0 && (
                <div className="w-75 mt-4 mb-3">
                    <h4 className="text-center">Existing Cars</h4>
                    <div className="d-flex gap-2 flex-wrap align-items-center justify-content-center">
                        {cars.map((car) => (
                            <div className="card" style={{ width: "18rem" }} key={car.id}>
                                <img src={car.imagePath} className="card-img-top" alt={`${car.brand} ${car.model}`} />
                                <div className="card-body">
                                    <h5 className="card-title">{car.brand} {car.model}</h5>
                                    <p className="card-text"><strong>Year:</strong> {car.year}</p>
                                    <p className="card-text"><strong>Price/Day:</strong> ${car.pricePerDay}</p>
                                    <p className="card-text"><strong>Status:</strong> {car.isAvailable ? "Available" : "Unavailable"}</p>
                                    <button className="btn btn-warning me-2" onClick={() => startEdit(car)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(car.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
export default ManageCars;