import { useState, useEffect } from "react";
import API from "../../services/api";
import Modal from "../../components/Modal";
import useShake from "../../components/useShake";
import emptyValidation from "../../utils/emptyValidation";

const CreateSubject = ({ discard }) => {
    const [form, setForm] = useState({
        subjectCode: "",
        subjectName: "",
        description: "",
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

            await API.post("/teacher/addSubject", {
                subject_code: form.subjectCode,
                subject_name: form.subjectName,
                description: form.description,
            });

            Modal.success("Subject Created Successfully");

            setForm({
                subjectCode: "",
                subjectName: "",
                description: "",
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
            subjectCode: !form.subjectCode,
            subjectName: !form.subjectName,
        };

        setErrors(newErrors);

        if (newErrors.subjectCode || newErrors.subjectName) {
            triggerShake();
            return;
        }

        onAdd();

        setForm({
            subjectCode: "",
            subjectName: "",
            description: "",
        });

        setErrors({});
    };

    useEffect(() => {
        if (discard === false) {
            setForm({
                subjectCode: "",
                subjectName: "",
                description: "",
            });

            setErrors({});
        }
    }, [discard]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-custom">
            <h2 className="text-xl font-bold text-primary mb-4">
                Create Subject
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div>
                    <input
                        name="subjectCode"
                        value={form.subjectCode}
                        onChange={handleChange}
                        placeholder="Subject Code"
                        className={ emptyValidation({ field:"subjectCode", errors, shake })}
                    />
                    {errors.subjectCode && (
                        <p className="text-red-500 text-sm mt-1">
                            Subject Code is required
                        </p>
                    )}
                </div>

                <div>
                    <input
                        name="subjectName"
                        value={form.subjectName}
                        onChange={handleChange}
                        placeholder="Subject Name"
                        className={ emptyValidation({ field:"subjectName", errors, shake })}
                    />
                    {errors.subjectName && (
                        <p className="text-red-500 text-sm mt-1">
                            Subject Name is required
                        </p>
                    )}
                </div>

                <div>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description (optional)"
                        className="border p-3 rounded-md w-full focus:outline-none focus:border-primary"
                    />
                </div>

                <button
                    disabled={loading}
                    className="bg-primary w-40 text-white py-2 rounded-md hover:bg-tertiary transition"
                >
                    {loading ? "Saving..." : "Save Subject"}
                </button>

            </form>
        </div>
    );
};

export default CreateSubject;