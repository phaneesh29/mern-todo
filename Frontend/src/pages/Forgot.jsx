import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Forgot = () => {
    const [email, setEmail] = useState("")
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const API_BASE_URL = import.meta.env.VITE_BASE_URL;
    const onForgot = async () => {
        try {
            setButtonDisabled(true)
            setLoading(true)
            const response = await axios.post(`${API_BASE_URL}/users/forgot`, { email })
            setError("")
            setSuccess(response?.data?.message)
        } catch (error) {
            console.log(error)
            setError(error?.response?.data?.error || error?.response?.data?.errors[0]?.msg || error.message || "Something went wrong")
        } finally {
            setButtonDisabled(false)
            setLoading(false)
            setEmail("")
        }
    }

    useEffect(() => {
        if (email) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [email])


    return (
        <div className="flex justify-center items-center h-screen w-screen flex-col gap-6 bg-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-lg flex justify-center items-center flex-col gap-4">
                {success && <div className="bg-green-100 p-4 rounded-lg">{success}</div>}
                {error && <div className="bg-red-100 text-red-500 p-4 rounded-lg">{error}</div>}
                <h1 className="text-2xl font-semibold mb-4">{loading ? "Processing" : "Forgot Password"}</h1>
                <div className="flex flex-col justify-center items-start gap-1 text-lg">
                    <label className="w-[100px]" htmlFor="email">Email</label>
                    <input value={email} type="email" id="email" onChange={(e) => setEmail(e.target.value)} placeholder="someone@someone.com" className="bg-transparent ring-2 ring-slate-700 p-2 rounded-lg w-[300px] focus:outline-none" />
                    <span className="text-sm mt-2">Login back, <Link to="/login" className="text-indigo-500">Click here </Link></span>

                </div>
                <div className="flex flex-col justify-center  gap-1 text-lg">
                    <button onClick={onForgot} disabled={buttonDisabled} className={`p-3 bg-blue-800 rounded-lg text-white hover:bg-blue-500 transition-all duration-300 ${buttonDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>{buttonDisabled ? "Confirm" : "Confirm"} </button>
                </div>
            </div>
        </div>
    )
}

export default Forgot