import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import useAuthStore from "../store/useAuthStore";
import emptyValidation from "../utils/emptyValidation";
import useShake from "../components/useShake";

const LoginPage = () => {
    const navigate = useNavigate();

    const login = useAuthStore((state) => state.login);
    const token = useAuthStore((state) => state.token);
    const role = useAuthStore((state) => state.role);

    const [form, setForm] = useState({
        userName: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const { shake, triggerShake } = useShake();

    const [error, setError] = useState(".");
    const [errorColor, setErrorColor] = useState("text-white");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: false,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const newErrors = {
            userName: !form.userName,
            password: !form.password,
        };

        setErrors(newErrors);

        if (Object.values(newErrors).includes(true)) {
            triggerShake();
            return;
        }

        try {
            const res = await API.post("/login", form);

            login(res.data);

            res.data.user.role === "teacher"
                ? navigate("/teacher")
                : navigate("/student");

        } catch (error) {
            setError(error.response?.data?.message || "User not found");
            setErrorColor("text-red-600");

            setTimeout(() => {
                setError(".");
                setErrorColor("text-white");
            }, 5000);
        }
    };

    useEffect(() => {
        if (!token || !role) return;

        if (token && role) {
            if (role === "teacher") navigate("/teacher");
            else navigate("/student");
        }
    }, [token, role]);

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center items-center px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-custom overflow-hidden">

                <div className="bg-primary p-8">
                    <h1 className="text-4xl font-bold text-white font-main">AMS</h1>
                    <p className="text-slate-300 mt-2">Attendance Monitoring System</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 flex flex-col gap-5">

                    <div>
                        <label className="font-semibold text-primary">Username</label>

                        <input
                            type="text"
                            name="userName"
                            placeholder="Enter Username"
                            value={form.userName}
                            onChange={handleChange}
                            className={ emptyValidation({ field: "userName", errors, shake })}
                        />

                        { errors.userName && <p className="text-red-500 text-sm mt-1">Username is required</p> }
                    </div>

                    <div>
                        <label className="font-semibold text-primary">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            value={form.password}
                            onChange={handleChange}
                            className={ emptyValidation({ field: "password", errors, shake })}
                        />

                        { errors.password && <p className="text-red-500 text-sm mt-1">Password is required</p> }
                    </div>

                    <label className={`${errorColor} font-bold text-center select-none`}>{error}</label>

                    <button className="bg-primary text-white p-3 rounded-md font-semibold hover:bg-primary/90 transition-all duration-300">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;