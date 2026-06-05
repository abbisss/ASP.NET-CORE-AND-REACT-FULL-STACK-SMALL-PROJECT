import { getUsers, deleteUser } from "../services/UsersService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ManageUsers() {
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        try {
            const response = await getUsers();
            const filtered = response.data.filter(u => u.role === "user");
            setUsers(filtered);
        } catch (error) {
            console.error("Error loading users:", error);
            toast.error("Failed to load users.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(id);
                toast.success("User deleted successfully!");
                loadUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user.");
            }
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadUsers();
    }, []);

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center bg-dark text-light min-vh-100">
            <h2 className="mb-4">Manage Users</h2>

            {users.length > 0 ? (
                <div className="w-75">
                    <table className="table table-dark table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No non‑admin users found.</p>
            )}
        </div>
    );
}

export default ManageUsers;