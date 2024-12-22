import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardPage = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ title: "", description: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_BASE_URL;

    // Check if user is logged in by verifying token in localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // Redirect to login if no token
        }
    }, [navigate]);

    // Fetch the user's todos when the component mounts
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/user/todos`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setTodos(response.data);
            } catch (err) {
                if (err.response && err.response.data) {
                    setError(err.response.data.message);
                } else {

                    setError("Failed to fetch todos. Please try again.");
                }
            };
        }

        fetchTodos();
    }, []);

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.title) {
            setError("Title is required");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/user/todos`,
                {
                    title: newTodo.title,
                    description: newTodo.description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setTodos([...todos, response.data]);
            setNewTodo({ title: "", description: "" });
            setError("");
        } catch (err) {
            setError("Failed to add todo. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleComplete = async (todoId) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/user/todos/${todoId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            const updatedTodos = todos.map((todo) =>
                todo._id === todoId ? response.data : todo
            );
            setTodos(updatedTodos);
        } catch (err) {
            setError("Failed to update todo. Please try again.");
        }
    };

    const handleDeleteTodo = async (todoId) => {
        try {
            await axios.delete(`${API_BASE_URL}/user/todos/${todoId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setTodos(todos.filter((todo) => todo._id !== todoId));
        } catch (err) {
            setError("Failed to delete todo. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleProfileRedirect = () => {
        navigate("/profile");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-4 py-6">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-2xl mx-auto">
                {/* Top Right Profile and Logout buttons */}
                <div className="flex justify-between mb-6">
                    <button
                        onClick={handleProfileRedirect}
                        className="py-2 px-4 bg-indigo-500 text-white font-semibold rounded-md shadow-md hover:bg-indigo-600"
                    >
                        View Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>

                {/* Error message */}
                {error && <p className="text-red-600 text-center font-semibold">{error}</p>}

                {/* Add Todo Section */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Add a New Todo</h2>
                    <form onSubmit={handleAddTodo} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium" htmlFor="title">
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={newTodo.title}
                                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter title"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={newTodo.description}
                                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter description"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`py-2 px-4 bg-green-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {loading ? "Adding..." : "Add Todo"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Display all Todos */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Your Todos</h2>
                    <ul className="space-y-4">
                        {todos.map((todo) => (
                            <li
                                key={todo._id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-md shadow-sm"
                            >
                                <div className="flex-1">
                                    <h3
                                        className={`text-xl font-medium ${todo.completed ? "line-through text-gray-500" : "text-gray-800"
                                            }`}
                                    >
                                        {todo.title}
                                    </h3>
                                    <p className="text-gray-600">{todo.description}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleToggleComplete(todo._id)}
                                        className={`py-2 px-4 text-white font-semibold rounded-md ${todo.completed ? "bg-gray-500" : "bg-blue-500"
                                            }`}
                                    >
                                        {todo.completed ? "Completed" : "Mark as Complete"}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTodo(todo._id)}
                                        className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
