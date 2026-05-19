import { useState, useEffect } from "react";
import API from "../../services/api";
import useAuthStore from "../../store/useAuthStore";
import Modal from "../../components/Modal";
import useShake from "../../components/useShake";
import emptyValidation from "../../utils/emptyValidation";

const CreateEnrollStudent = ( { discard } ) => {
    const teacher = useAuthStore((state) => state.user);

    const [form, setForm] = useState({
        studentId: "",
        classId: "",
    });

    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { shake, triggerShake } = useShake();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersData = await API.get("/teacher/getStudents");
                setStudents(usersData.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(form.studentId){
                    const classesData = await API.get(`/teacher/classesOfStudentNotEnrolledIn/${form.studentId}/${teacher.user_id}`);
                    setClasses(classesData.data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [form.studentId]);

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

            await API.post("/teacher/enroll", {
                student_id: form.studentId,
                class_id: form.classId,
                enrolled_at: new Date().toISOString().split("T")[0],
            });

            Modal.success("Student enrolled successfully");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            studentId: !form.studentId,
            classId: !form.classId,
        };

        setErrors(newErrors);

        if (newErrors.studentId || newErrors.classId) {
            triggerShake();
            return;
        }

        onAdd();

        setForm({
            studentId: "",
            classId: "",
        });

        setErrors({});
    };

    useEffect(() => {
        if (discard === false) {
            setForm({
                studentId: "",
                classId: "",
            });

            setErrors({});
        }
    }, [discard]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-custom">
            <h2 className="text-xl font-bold text-primary mb-4">
                Enroll Student
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div>
                    <select
                        name="studentId"
                        value={form.studentId}
                        onChange={handleChange}
                        className={ emptyValidation({ field:"studentId", errors, shake })}
                    >
                        <option value="">Select Student</option>
                        {students.map((s) => (
                            <option key={s.user_id} value={s.user_id}>
                                {s.user_id} - {s.firstName} {s.lastName}
                            </option>
                        ))}
                    </select>

                    { errors.studentId && <p className="text-red-500 text-sm mt-1">Student is required </p> }
                </div>

                <div>
                    <select
                        name="classId"
                        value={form.classId}
                        onChange={handleChange}
                        className={ emptyValidation({ field:"classId", errors, shake })}
                    >
                        <option value="">Select Class</option>
                        
                        { classes.length === 0 ? <option disabled>No classes found</option>
                        : 
                        (
                            classes.map((c) => (
                                <option key={c.class_id} value={c.class_id}>
                                    {c.class_id} - {c.subject_name}
                                </option>
                            ))
                        )}
                    </select>

                    { errors.classId &&  <p className="text-red-500 text-sm mt-1">Class is required</p> }
                </div>

                <button
                    disabled={loading}
                    className="bg-primary w-40 text-white py-2 rounded-md hover:bg-tertiary transition"
                >
                    {loading ? "Enrolling..." : "Enroll Student"}
                </button>

            </form>
        </div>
    );
};

export default CreateEnrollStudent;