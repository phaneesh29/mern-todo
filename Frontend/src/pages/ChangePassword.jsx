import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const API_BASE_URL = import.meta.env.VITE_BASE_URL;
    const changePass = async () => {
        try {
            setButtonDisabled(true)
            setLoading(true)
            if (password !== confirmPassword) {
                setError("Passwords do not match")
                return
            }
            const response = await axios.post(`${API_BASE_URL}/users/changepassword`, { token, password, confirmPassword })
            setError("")
            setSuccess(response.data.message);
            navigate("/login")

        } catch (error) {
            setError(error?.response?.data?.error || error.message || "Something went wrong")
        } finally {
            setButtonDisabled(false)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (password && confirmPassword) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [password, confirmPassword])

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    return (
        <div className="flex flex-col items-center justify-center bg-blue-200 gap-2 min-h-screen py-2">
            {success && <div className="bg-green-100 p-4 rounded-lg">{success}</div>}
            {error && <div className="bg-red-100 p-4 rounded-lg">{error}</div>}
            <div className="bg-white p-8 rounded-lg shadow-lg flex justify-center items-center flex-col gap-4">
                <h1 className="text-2xl font-semibold mb-8">{loading ? "Processing" : "Change Password"}</h1>

                <div className="flex flex-col justify-center items-start gap-5">
                    <div className="flex flex-col justify-center items-start gap-1 text-lg">
                        <label className="w-[100px]" htmlFor="password">Password</label>
                        <input value={password} type="password" id="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="bg-transparent ring-2 ring-slate-700 p-2 rounded-lg w-[300px] focus:outline-none" />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-1 text-lg">
                        <label className="w-[200px]" htmlFor="cnf-password">Confirm Password</label>
                        <input value={confirmPassword} type="password" id="cnf-password" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="bg-transparent ring-2 ring-slate-700 p-2 rounded-lg w-[300px] focus:outline-none" />
                    </div>
                </div>
                <div className="flex flex-col justify-center  gap-1 text-lg">
                    <button onClick={changePass} disabled={buttonDisabled} className={`p-3 text-white bg-blue-800 rounded-lg hover:bg-blue-500 transition-all duration-300 ${buttonDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>{buttonDisabled ? "Change" : "Change"} </button>
                    <span className="text-sm ">Login , <Link href="/login" className="text-indigo-800">here </Link></span>
                </div>
            </div>

        </div>
    )
}

export default ChangePassword