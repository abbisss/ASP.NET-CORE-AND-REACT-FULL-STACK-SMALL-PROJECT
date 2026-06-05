import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ManageCars from "./pages/ManageCars";
import ManageUsers from "./pages/ManageUsers";
import ManageRentals from "./pages/ManageRentals";
import UserRentals from "./pages/UserRentals";
function App() {
    return (
        <div className="bg-dark min-vh-100 text-light">
        <BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
            <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                        <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manage-cars"
                    element={
                        <ProtectedRoute>
                        <ManageCars />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manage-users"
                    element={
                        <ProtectedRoute>
                        <ManageUsers />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manage-rentals"
                    element={
                        <ProtectedRoute>
                            <ManageRentals />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user-rentals"
                    element={
                        <ProtectedRoute>
                            <UserRentals />
                        </ProtectedRoute>
                    }
                />


            </Routes>

        </BrowserRouter>
        </div>
    )
}

export default App

