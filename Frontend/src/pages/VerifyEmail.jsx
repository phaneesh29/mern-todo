import axios from "axios"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"

const VerifyEmail = () => {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_BASE_URL;

    const verifyUserEmail = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/verifyemail`, { token })
            setVerified(true);
        } catch (error) {
            setError(error?.response?.data?.error || "Error verifying email");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, [])

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    if (loading) {
        return (<div className="flex justify-center items-center h-screen">
            <div className="border-gray-800 h-24 w-24 rounded-full border-4 border-e-6 border-e-gray-400 animate-spin">
            </div>
        </div>)
    }


    return (
        <div className={`flex flex-col items-center justify-center gap-16 min-h-screen py-2 ${error ? "bg-red-100" : "bg-gray-100"}`}>

            <h1 className="text-4xl font-semibold">Verify Email</h1>
            <h2 className=" p-2 font-semibold text-base rounded-lg transition-all duration-300"><span className="font-semibold text-xl">Token</span>: {token ? `${token}` : "No token"}</h2>

            {verified && (
                <div className="text-center bg-green-600 text-white font-semibold p-5 rounded-lg">
                    <h2 className="text-3xl mb-4">Email Verified</h2>
                    <Link to="/login" className="text-lg bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-950 transition-all duration-300">
                        Login
                    </Link>
                </div>
            )}

            {error && (
                <div>
                    <h2 className="text-2xl bg-red-800 text-white p-4 rounded-lg">{error}</h2>
                </div>
            )}
        </div>
    )
}

export default VerifyEmail