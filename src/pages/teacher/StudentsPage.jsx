import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Table from "../../components/Table.jsx";
import useAuthStore from "../../store/useAuthStore";
import { formatDate } from "../../formats/date.jsx";

const StudentsPage = () => {

    const navigate = useNavigate();

    const teacherId = useAuthStore((state) => state.user.user_id);

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedAttendance, setSelectedAttendance] = useState(null);

    useEffect(() => {
        const loadStudents = async () => {
            try {

                const res = await API.get(`/teacher/getEnrolledStudentsByTeacher/${teacherId}`);

                const grouped = [];

                res.data.forEach((row) => {

                    let student = grouped.find((s) => s.user_id === row.user_id);

                    if (!student)
                        grouped.push(
                            (student = {
                                user_id: row.user_id,
                                firstName: row.firstName,
                                lastName: row.lastName,
                                email: row.email,
                                classes: [],
                            })
                        );

                    if ( row.class_id && !student.classes.some((c) => c.class_id === row.class_id) )
                        student.classes.push({
                            class_id: row.class_id,
                            subject_name: row.subject_name,
                            enrolled_at: row.enrolled_at,
                        });

                });

                setStudents(grouped);

            } catch (err) {
                console.error(err);
            }
        };

        loadStudents();
    }, [teacherId]);


    const loadAttendance = async (student_id, class_id) => {
        try {
            const res = await API.get( `/teacher/attendance/${student_id}/${class_id}` );
            return res.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    };


    const openAttendance = async (student_id, classItem) => {
        const attendance = await loadAttendance(student_id, classItem.class_id);

        setSelectedAttendance({
            ...classItem,
            attendance,
        });
    };


    return (
        <div className="bg-slate-100 min-h-screen p-6">

            <div className="bg-primary text-white p-6 rounded-xl shadow-md mb-6 flex justify-between">

                <div>
                    <h1 className="text-3xl font-bold">Students</h1>
                    <p className="text-slate-200">Enrolled students</p>
                </div>

                <button
                    onClick={() => navigate(`/teacher`)}
                    className="hover:bg-tertiary px-4 py-2 rounded-md font-semibold transition"
                >
                    Go Back
                </button>

            </div>

            <Table
                title="Students"
                data={students}
                getRowKey={(item) => item.user_id}
                onRowClick={(item) => setSelectedStudent(item)}
                columns={[
                    { label: "Student ID", field: "user_id" },
                    { label: "First Name", field: "firstName" },
                    { label: "Last Name", field: "lastName" },
                    { label: "Email", field: "email" },
                ]}
            />

            {selectedStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

                    <div className="bg-white w-full max-w-5xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">

                        <div className="flex justify-between mb-6">

                            <div>
                                <h2 className="text-2xl font-bold text-primary">
                                    {selectedStudent.firstName} {selectedStudent.lastName}
                                </h2>

                                <p className="text-slate-500"> Enrolled Classes </p>
                            </div>

                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Close
                            </button>

                        </div>

                        <table className="w-full border-collapse">

                            <thead>
                                <tr className="bg-tertiary text-white">
                                    <th className="p-3 border">Subject</th>
                                    <th className="p-3 border">Enrolled At</th>
                                </tr>
                            </thead>

                            <tbody>
                                {selectedStudent.classes.map((c, i) => (
                                    <tr
                                        key={i}
                                        className="cursor-pointer hover:bg-slate-100 text-center" 
                                        onClick={() => openAttendance(selectedStudent.user_id, c)}
                                    >
                                        <td className="p-3 border">
                                            {c.subject_name}
                                        </td>

                                        <td className="p-3 border">
                                            {formatDate(c.enrolled_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>

                </div>
            )}

            {selectedAttendance && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">

                    <div className="bg-white w-full max-w-3xl rounded-xl p-6">

                        <div className="flex justify-between mb-4">

                            <h2 className="text-xl font-bold text-primary">
                                Attendance - {selectedAttendance.subject_name}
                            </h2>

                            <button
                                onClick={() => setSelectedAttendance(null)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Close
                            </button>

                        </div>

                        <table className="w-full border-collapse">

                            <thead>
                                <tr className="bg-tertiary text-white">
                                    <th className="p-3 border">Status</th>
                                    <th className="p-3 border">Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {selectedAttendance.attendance?.length > 0 ? (
                                    selectedAttendance.attendance.map((a) => (
                                        <tr key={a.attendance_id}>
                                            <td className="p-3 border text-center">{a.status}</td>
                                            <td className="p-3 border text-center">
                                                {formatDate(a.submitted_at)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="text-center p-4 text-slate-500">
                                            No attendance found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsPage;