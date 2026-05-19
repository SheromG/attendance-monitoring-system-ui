import { useState, useEffect  } from "react";
import API from "../../services/api";
import Modal from "../../components/Modal";
import useShake from "../../components/useShake";
import emptyValidation from "../../utils/emptyValidation";

const CreateSection = ( { discard } ) => {
    const [form, setForm] = useState({
        sectionName: "",
        yearLevel: "",
        schoolYear: "",
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

            await API.post("teacher/sections", { 
                section_name: form.sectionName,
                year_level: form.yearLevel,
                school_year: form.schoolYear
            });

            Modal.success("Section Created Successfully");

            setForm({
                sectionName: "",
                yearLevel: "",
                schoolYear: "",
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
            sectionName: !form.sectionName,
            yearLevel: !form.yearLevel,
            schoolYear: !form.schoolYear,
        };

        setErrors(newErrors);

        if (newErrors.sectionName || newErrors.yearLevel || newErrors.schoolYear) {
            triggerShake();
            return;
        }

        onAdd(form);

        setForm({
            sectionName: "",
            yearLevel: "",
            schoolYear: "",
        });

        setErrors({});
    };

    useEffect(() => {
        if (discard === false) {
            setForm({
                sectionName: "",
                yearLevel: "",
                schoolYear: "",
            });

            setErrors({});
        }
    }, [discard]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-custom">
            <h2 className="text-xl font-bold text-primary mb-4">
                Create Section
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div>
                    <input
                        name="sectionName"
                        value={form.sectionName}
                        onChange={handleChange}
                        placeholder="Section Name"
                        className={ emptyValidation({ field:"sectionName", errors, shake })}
                    />
                    { errors.sectionName && ( <p className="text-red-500 text-sm mt-1"> Section Name is required </p> )}
                </div>

                <div>
                    <input
                        name="yearLevel"
                        value={form.yearLevel}
                        onChange={handleChange}
                        placeholder="Year Level"
                        className={ emptyValidation({ field:"yearLevel", errors, shake })}
                    />
                    { errors.yearLevel && ( <p className="text-red-500 text-sm mt-1"> Year Level is required </p> )}
                </div>

                <div>
                    <input
                        name="schoolYear"
                        value={form.schoolYear}
                        onChange={handleChange}
                        placeholder="School Year (e.g. 2025-2026)"
                        className={ emptyValidation({ field:"schoolYear", errors, shake })}
                    />
                    { errors.schoolYear && ( <p className="text-red-500 text-sm mt-1"> School Year is required </p> )}
                </div>

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

export default CreateSection;