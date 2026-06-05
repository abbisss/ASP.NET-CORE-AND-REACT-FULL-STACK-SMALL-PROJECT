import { AdminLogin } from "../services/AuthService";
import { UserLogin } from "../services/UsersService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        Username: "",
        Password: ""
    });
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };


    const login = async (e) => {
        e.preventDefault();
        try {
            const result = await AdminLogin(user);
            localStorage.setItem("token", result.data.token);
            navigate("/admin");
            toast.success("Logged in as admin");
            return;
        } catch (e) {
            if (e.response?.status !== 401) {
                toast.error("Server error, please try again");
                return; 
            }
        }

        try {
            const result = await UserLogin(user);
            localStorage.setItem("token", result.data.token);
            navigate("/home");
            toast.success("Logged in successfully");
        } catch (e) {
            console.error(e);
            toast.error("Invalid username or password");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card p-4 shadow">
                        <h2 className="text-center mb-4">Login</h2>

                        <form>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={user.Username}
                                    onChange={handleChange}
                                    name="Username"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={user.Password}
                                    onChange={handleChange}
                                    name="Password"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100"
                                onClick={login}>
                                Login
                            </button>
                        </form>

                        <p className="text-center mt-3 mb-0">
                            Don’t have an account?{" "}
                            <a href="/register">Sign Up</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;