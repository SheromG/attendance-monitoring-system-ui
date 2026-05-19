import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Table from "../../components/Table.jsx";
import useAuthStore from "../../store/useAuthStore";
import { formatDate } from "../../formats/date.jsx";

const ClassesPage = () => {

    const navigate = useNavigate();

    const teacherId = useAuthStore((state) => state.user.user_id);

    const [classes, setClasses] = useState([]);

    const [selectedClass, setSelectedClass] = useState(null);

    useEffect(() => {
        const loadClasses = async () => {
            try {
                const res = await API.get(`/teacher/classesAndSubject/${teacherId}`);

                const groupedClasses = [];

                res.data.forEach((row) => {

                    let existingClass = groupedClasses.find( (c) => c.class_id === row.class_id);

                    if (!existingClass)
                        groupedClasses.push(
                            (existingClass = {
                                class_id: row.class_id,
                                teacher_id: row.teacher_id,
                                section_id: row.section_id,
                                section_name: row.section_name,
                                subject_id: row.subject_id,
                                subject_name: row.subject_name,
                                semester: row.semester,
                                schedules: [],
                                students: [],
                            })
                        );

                    if ( row.schedule_id && !existingClass.schedules.some((s) => s.schedule_id === row.schedule_id) )
                        existingClass.schedules.push({
                            schedule_id: row.schedule_id,
                            type: row.type,
                            day: row.day,
                            start_time: row.start_time,
                            end_time: row.end_time,
                            assigned_room: row.assigned_room,
                        });

                    if ( row.enrollment_id && !existingClass.students.some((s) => s.enrollment_id === row.enrollment_id) )
                        existingClass.students.push({
                            enrollment_id: row.enrollment_id,
                            student_id: row.student_id,
                            enrolled_at: row.enrolled_at,
                            firstName: row.firstName,
                            lastName: row.lastName,
                        });

                });

                setClasses(groupedClasses);

            } catch (err) {
                console.error(err);
            }
        };

        loadClasses();
    }, [teacherId]);


    return (
        <div className="bg-slate-100 min-h-screen p-6">

            <div className="bg-primary text-white p-6 rounded-xl shadow-md mb-6 flex justify-between">

                <div>
                    <h1 className="text-3xl font-bold">Classes</h1>

                    <p className="text-slate-200">Manage all classes</p>
                </div>

                <button
                    onClick={() => navigate(`/teacher`)}
                    className="hover:bg-tertiary px-4 py-2 rounded-md font-semibold transition"
                >
                    Go Back
                </button>

            </div>

                <Table
                    title="Classes"
                    data={classes}
                    getRowKey={(item) => item.class_id}
                    onRowClick={(item) => setSelectedClass(item)}
                    columns={[
                        { label: "Class ID", field: "class_id" },
                        { label: "Section", field: "section_name" },
                        { label: "Subject", field: "subject_name" },
                        { label: "Semester", field: "semester" },
                    ]}
                />

            {selectedClass && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

                    <div className="bg-white w-full max-w-5xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">

                        <div className="flex justify-between items-center mb-6">

                            <div>
                                <h2 className="text-2xl font-bold text-primary">
                                    {selectedClass.subject_name}
                                </h2>

                                <p className="text-slate-500">
                                    Section {selectedClass.section_name}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedClass(null)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                            >
                                Close
                            </button>

                        </div>

                        <div className="mb-8">

                            <h3 className="text-xl font-bold mb-3">
                                Schedule
                            </h3>

                            <table className="w-full border-collapse">

                                <thead>
                                    <tr className="bg-tertiary text-white">
                                        <th className="p-3 border">Type</th>
                                        <th className="p-3 border">Day</th>
                                        <th className="p-3 border">Start</th>
                                        <th className="p-3 border">End</th>
                                        <th className="p-3 border">Room</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {selectedClass.schedules.length > 0 ? (
                                        selectedClass.schedules.map((schedule) => (
                                            <tr key={schedule.schedule_id}>
                                                <td className="p-3 border text-center">
                                                    {schedule.type}
                                                </td>

                                                <td className="p-3 border text-center">
                                                    {schedule.day}
                                                </td>

                                                <td className="p-3 border text-center">
                                                    {schedule.start_time}
                                                </td>

                                                <td className="p-3 border text-center">
                                                    {schedule.end_time}
                                                </td>

                                                <td className="p-3 border text-center">
                                                    {schedule.assigned_room}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-center p-4 text-slate-500 border"
                                            >
                                                No schedules found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>

                        </div>

                        <div>

                            <h3 className="text-xl font-bold mb-3">
                                Enrolled Students
                            </h3>

                            <table className="w-full border-collapse">

                                <thead>
                                    <tr className="bg-tertiary text-white">
                                        <th className="p-3 border">
                                            Student ID
                                        </th>

                                        <th className="p-3 border">
                                            Name
                                        </th>

                                        <th className="p-3 border">
                                            Enrolled At
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {selectedClass.students.length > 0 ? (
                                        selectedClass.students.map((student) => (
                                            <tr key={student.enrollment_id}>

                                                <td className="p-3 border text-center">
                                                    {student.student_id}
                                                </td>

                                                <td className="p-3 border text-center">
                                                    {student.firstName}{" "}
                                                    {student.lastName}
                                                </td>

                                                <td className="p-3 border text-center">
                                                    {formatDate(student.enrolled_at)}
                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="text-center p-4 text-slate-500 border"
                                            >
                                                No students enrolled
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassesPage;