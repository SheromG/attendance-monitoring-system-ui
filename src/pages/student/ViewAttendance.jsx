import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import API from "../../services/api";
import { formatDateOnly, formatTimeOnly } from "../../formats/date";

const ViewAttendance = (props) => {

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

    useEffect(() => {
        const loadClasses = async () => {
            try {
                const res = await API.get(`/student/classesAndSubject/${props.studentId}`);

                const groupedClasses = [];

                res.data.forEach((row) => {

                    let existingClass = groupedClasses.find(
                        (c) => c.class_id === row.class_id
                    );

                    if (!existingClass) {
                        groupedClasses.push(
                            (existingClass = {
                                class_id: row.class_id,
                                teacher_id: row.teacher_id,
                                section_id: row.section_id,
                                section_name: row.section_name,
                                subject_id: row.subject_id,
                                subject_name: row.subject_name,
                                semester: row.semester,
                                attendance: [],
                            })
                        );
                    }

                    if (row.attendance_id &&!existingClass.attendance.some((a) => a.attendance_id === row.attendance_id)) {
                        existingClass.attendance.push({
                            attendance_id: row.attendance_id,
                            status: row.status,
                            submitted_at: row.submitted_at,
                        });
                    }
                });

                setClasses(groupedClasses);

            } catch (err) {
                console.error(err);
            }
        };

        loadClasses();
    }, [props.studentId]);

    return (
        <>
            <Table
                title="View Attendance"
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
                    <div className="bg-white w-full max-w-4xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
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
                        <div>
                            <h3 className="text-xl font-bold mb-3">Attendance</h3>

                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-tertiary text-white">
                                        <th className="p-3 border">Date</th>
                                        <th className="p-3 border">Time</th>
                                        <th className="p-3 border">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {selectedClass.attendance.length > 0 ? (
                                    selectedClass.attendance.map((att) => {

                                        return (
                                            <tr key={att.attendance_id} className="text-center">

                                                <td className="p-3 border">
                                                    {formatDateOnly(att.submitted_at)}
                                                </td>

                                                <td className="p-3 border">
                                                {formatTimeOnly(att.submitted_at)}
                                                </td>

                                                <td className="p-3 border">
                                                    {att.status}
                                                </td>

                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="text-center p-4 text-slate-500 border"
                                        >
                                            No attendance found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewAttendance;