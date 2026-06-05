import {createUser} from "../services/UsersService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {Link} from "react-router-dom";
function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        Username: "",
        Password: "",
        Role: "user"
    });
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const Register = async (e) => {
        e.preventDefault();
        if (!user.Username || !user.Password) {
            toast.error("Please fill in all fields");
            return;
        }
        try{
            await createUser(user);
            toast.success("Registered successfully, you can now login");
            navigate("/");
        } catch (e) {
            console.error(e);
            toast.error("Error registering user");
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card p-4 shadow">
                        <h2 className="text-center mb-4">Register</h2>

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
                                onClick={Register}>
                                Register
                            </button>
                        </form>

                        <p className="text-center mt-3 mb-0">
                            Don’t have an account?{" "}
                            <Link to="/">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;