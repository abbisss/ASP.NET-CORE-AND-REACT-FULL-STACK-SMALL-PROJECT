import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    let user = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            user = {
                username:
                    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                role:
                    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
            };
        } catch (e) {
            console.error("Invalid token", e);
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg border-secondary border-bottom">
            <div className="container d-flex">
                <div className="d-flex gap-4">
                    <img
                        src="/logo.jpg"
                        alt="Logo"
                        className="rounded-circle"
                        style={{ width: "50px", height: "50px", objectFit: "fit" }}

                    />
                    {user && (<h3 className="mt-2">Welcome {user.username}!</h3>)}
                </div>

                <Link className="navbar-brand fw-bold fs-3" to="/">Car Rental System</Link>
                <div>
                    {user && user.role === "user" && (
                        <>
                            <Link className="btn btn-light me-2" to="/home">Home</Link>
                            <Link className="btn btn-light me-2" to="/user-rentals">My Rentals</Link>
                            <button className="btn btn-danger" onClick={logout}>Logout</button>
                        </>
                    )}

                    {user && user.role === "admin" && (
                        <div className="d-flex align-items-center">
                            <Link className="btn btn-warning me-2" to="/admin">Dashboard</Link>
                            <Link className="btn btn-warning me-2" to="/manage-cars">Cars</Link>
                            <Link className="btn btn-warning me-2" to="/manage-users">Users</Link>
                            <Link className="btn btn-warning me-2" to="/manage-rentals">Rentals</Link>
                            <button className="btn btn-danger" onClick={logout}>Logout</button>
                        </div>
                    )}

                    {(!user || !user.role) && (
                        <>
                            <Link className="btn btn-success" to="/">Login</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;