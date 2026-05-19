import { useState, useEffect } from "react";
import API from "../../services/api";
import Modal from "../../components/Modal";
import useAuthStore from "../../store/useAuthStore";
import useShake from "../../components/useShake";
import emptyValidation from "../../utils/emptyValidation";

const CreateSchedule = ({ discard }) => {
    const teacherId = useAuthStore((state) => state.user.user_id);

    const [form, setForm] = useState({
        classId: "",
        type: "",
        day: "",
        startTime: "",
        endTime: "",
        assignedRoom: "",
    });

    const [classes, setClasses] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { shake, triggerShake } = useShake();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await API.get(`/teacher/classesAndSubject/${teacherId}`);

                const grouped = Array.from( new Map(res.data.map(item => [item.class_id, item])).values());

                const classesWithoutSchedule = grouped.filter((c) => { return !res.data.some((row) =>row.class_id === c.class_id && row.schedule_id);});

                setClasses(classesWithoutSchedule);
            } catch (err) {
                console.log(err);
            }
        };

        if (teacherId) fetchClasses();
    }, [teacherId]);

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

            await API.post("/teacher/schedules", {
                class_id: form.classId,
                type: form.type,
                day: form.day,
                start_time: form.startTime,
                end_time: form.endTime,
                assigned_room: form.assignedRoom,
            });

            Modal.success("Schedule Created Successfully");

            setForm({
                classId: "",
                type: "",
                day: "",
                startTime: "",
                endTime: "",
                assignedRoom: "",
            });

            setErrors({});
        } catch (err) {
            Modal.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            classId: !form.classId,
            type: !form.type,
            day: !form.day,
            startTime: !form.startTime,
            endTime: !form.endTime,
            assignedRoom: !form.assignedRoom,
        };

        setErrors(newErrors);

        if (Object.values(newErrors).includes(true)) {
            triggerShake();
            return;
        }

        onAdd();
    };

    useEffect(() => {
        if (discard === false) {
            setForm({
                classId: "",
                type: "",
                day: "",
                startTime: "",
                endTime: "",
                assignedRoom: "",
            });

            setErrors({});
        }
    }, [discard]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-custom">
            <h2 className="text-xl font-bold text-primary mb-4">Create Schedule</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <select
                    name="classId"
                    value={form.classId}
                    onChange={handleChange}
                    className={ emptyValidation({field:"classId", errors, shake })}
                >
                    <option value="">Select Class</option>

                    {classes.map((c) => (
                        <option key={c.class_id} value={c.class_id}>
                            {c.subject_name} - {c.section_name}
                        </option>
                    ))}
                </select>

                { errors.classId && <p className="text-red-500 text-sm">Class is required </p> }

                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className={ emptyValidation({field:"type", errors, shake })}
                >
                    <option value="">Select Type</option>
                    <option value="Lecture">Lecture</option>
                    <option value="Laboratory">Laboratory</option>
                </select>

                { errors.type && <p className="text-red-500 text-sm">Type is required</p> }

                <select
                    name="day"
                    value={form.day}
                    onChange={handleChange}
                    className={ emptyValidation({ field:"day", errors, shake })}
                >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                </select>

                { errors.day &&  <p className="text-red-500 text-sm">Day is required</p> }

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Start Time</label>

                        <input
                            type="time"
                            name="startTime"
                            value={form.startTime}
                            onChange={handleChange}
                            className={ emptyValidation({ field:"startTime", errors, shake })}
                        />

                        { errors.startTime &&  <p className="text-red-500 text-sm mt-1">Start time is required</p> }
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">End Time</label>

                        <input
                            type="time"
                            name="endTime"
                            value={form.endTime}
                            onChange={handleChange}
                            className={ emptyValidation({ field:"endTime", errors, shake })}
                        />

                        { errors.endTime && <p className="text-red-500 text-sm mt-1">End time is required</p> }
                    </div>
                </div>

                <select
                    name="assignedRoom"
                    value={form.assignedRoom}
                    onChange={handleChange}
                    className={ emptyValidation({ field:"assignedRoom", errors, shake })}
                >
                    <option value="">Select Room</option>
                    <option value="COMLAB1">COMLAB1</option>
                    <option value="COMLAB2">COMLAB2</option>
                </select>

                { errors.assignedRoom && <p className="text-red-500 text-sm">Room is required</p> }

                <button
                    disabled={loading}
                    className="bg-primary w-40 text-white py-2 rounded-md hover:bg-tertiary transition"
                >
                    {loading ? "Saving..." : "Save Schedule"}
                </button>
            </form>
        </div>
    );
};

export default CreateSchedule;