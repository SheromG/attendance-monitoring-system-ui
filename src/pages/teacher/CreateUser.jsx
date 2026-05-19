import { useState, useEffect } from "react";
import API from "../../services/api";
import Modal from "../../components/Modal";
import useShake from "../../components/useShake";
import emptyValidation from "../../utils/emptyValidation";

const CreateUser = ({ discard, defaultRole = "student" }) => {
    const [form, setForm] = useState({
        user_id: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        role: defaultRole,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { shake, triggerShake } = useShake();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setErrors({
            ...errors,
            [e.target.name]: false,
        });
    };

    const onAdd = async () => {
        try {
            setLoading(true);

            await API.post("teacher/addUser", {
                ...form,
                created_date: new Date().toISOString().split("T")[0],
            });

            Modal.success("User Created Successfully")

            setForm({
                user_id: "",
                username: "",
                password: "",
                firstName: "",
                lastName: "",
                email: "",
                role: defaultRole,
            });
            
        } catch (err) {
            Modal.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            user_id: !form.user_id,
            username: !form.username,
            password: !form.password,
            firstName: !form.firstName,
            lastName: !form.lastName,
            email: !form.email,
        };

        setErrors(newErrors);

        if (Object.values(newErrors).includes(true)) {
            triggerShake();
            return;
        }

        onAdd();

        setErrors({});
    };

    useEffect(() => {
        if (discard === false) {
            setForm({
                user_id: "",
                username: "",
                password: "",
                firstName: "",
                lastName: "",
                email: "",
                role: defaultRole,
            });

            setErrors({});
        }
    }, [discard, defaultRole]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-custom">
            <h2 className="text-xl font-bold text-primary mb-4">
                Create {form.role === "student" ? "Student" : "Teacher"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="border p-3 rounded-md"
                >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>

                <input
                    name="user_id"
                    value={form.user_id}
                    onChange={handleChange}
                    placeholder="User ID"
                    className={ emptyValidation({ field:"user_id", errors, shake })}
                />
                {errors.user_id && <p className="text-red-500 text-sm">User ID required</p>}

                <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className={ emptyValidation({ field:"username", errors, shake })}
                />
                {errors.username && <p className="text-red-500 text-sm">Username required</p>}

                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={ emptyValidation({ field:"password", errors, shake })}
                />
                {errors.password && <p className="text-red-500 text-sm">Password required</p>}

                <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className={ emptyValidation({ field:"firstName", errors, shake })}
                />
                {errors.firstName && <p className="text-red-500 text-sm">First name required</p>}

                <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className={ emptyValidation({ field:"lastName", errors, shake })}
                />
                {errors.lastName && <p className="text-red-500 text-sm">Last name required</p>}

                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className={ emptyValidation({ field:"email", errors, shake })}
                />
                {errors.email && <p className="text-red-500 text-sm">Email required</p>}

                <button
                    disabled={loading}
                    className="bg-primary w-40 text-white py-2 rounded-md hover:bg-tertiary transition"
                >
                    {loading ? "Saving..." : "Create User"}
                </button>

            </form>
        </div>
    );
};

export default CreateUser;