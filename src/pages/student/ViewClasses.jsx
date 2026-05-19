import React, { useState, useEffect} from 'react'
import Table from '../../components/Table'
import API from '../../services/api';
import { formatTime } from '../../formats/time';
import Button from '../../components/Button';
import Modal from "../../components/Modal"

const ViewClasses = (props) => {

    const [classes, setClasses] = useState([]);

    const [selectedClass, setSelectedClass] = useState(null);

    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const [hasAttendanceToday, setHasAttendanceToday] = useState(false);

    useEffect(() => {
        const loadClasses = async () => {
            try {
                const res = await API.get(`/student/classesAndSubject/${props.studentId}`);

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
    }, [props.studentId]);

    useEffect(() => {
        const loadAttendance = async () => {
            try {
                if (!selectedClass) return;

                const res = await API.get(`/student/attendance/${props.studentId}/${selectedClass.class_id}`);

                const records = res.data;

                setAttendanceRecords(records);

                const schedule = selectedClass?.schedules?.[0];
                if (!schedule) return;

                const today = new Date().toDateString();

                const hasAttendanceToday = records?.some((att) => {

                    const submitted = new Date(att.submitted_at);

                    if (submitted.toDateString() !== today) return false;

                    const [startH, startM] = schedule.start_time.split(":");
                    const [endH, endM] = schedule.end_time.split(":");

                    const start = new Date(submitted);
                    start.setHours(startH, startM, 0, 0);

                    const end = new Date(submitted);
                    end.setHours(endH, endM, 0, 0);

                    return submitted >= start && submitted <= end;
                });

                setHasAttendanceToday(hasAttendanceToday);
            } catch (err) {
                console.error(err);
            }
        };

        loadAttendance();
    }, [selectedClass]);


    const submitAttendance = async () => {
        try {
            const schedule = selectedClass?.schedules?.[0];
            if (!schedule) return;

            const now = new Date();

            const today = now.toISOString().split("T")[0];

            const [startH, startM] = schedule.start_time.split(":");
            const [endH, endM] = schedule.end_time.split(":");

            const start = new Date(`${today}T${schedule.start_time}`);
            const end = new Date(`${today}T${schedule.end_time}`);

            const earlyThreshold = new Date(start);
            earlyThreshold.setMinutes(earlyThreshold.getMinutes() - 30);

            let status = "";

            if (now < earlyThreshold) {
                status = "Absent"; 
            } else if (now >= earlyThreshold && now <= start) {
                status = "Present";
            } else if (now > start && now <= end) {
                status = "Late";
            } else {
                status = "Absent";
            }

            await API.post("/student/submitAttendance", {
                student_id: props.studentId,
                class_id: selectedClass.class_id,
                status,
                submitted_at: now,
            });


            Modal.success("Attendance Submitted");

            setHasAttendanceToday(true);

        } catch (err) {
            console.error(err);
        }
    };

    const hasScheduleToday = selectedClass?.schedules?.some((schedule) => {
        const today = new Date().toLocaleDateString("en-US", {
            weekday: "long",
        });

        return schedule.day === today;
    });
    
    return (
        <>
            <Table
                title="View Classes"
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
            { selectedClass && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white w-full max-w-4xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-primary">{selectedClass.subject_name}</h2>
                            <p className="text-slate-500">Section {selectedClass.section_name}</p>
                        </div>
                        <button
                            onClick={() => setSelectedClass(null)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                        >
                            Close
                        </button>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-3">Schedule</h3>
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
                                        <tr key={schedule.schedule_id} className='text-center'>
                                            <td className="p-3 border"> {schedule.type} </td>
                                            <td className="p-3 border"> {schedule.day} </td>
                                            <td className="p-3 border"> {formatTime(schedule.start_time)} </td>
                                            <td className="p-3 border"> {formatTime(schedule.end_time)} </td>
                                            <td className="p-3 border"> {schedule.assigned_room} </td>
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
                        {
                            hasScheduleToday && !hasAttendanceToday &&
                            (
                                <div className="flex justify-center mt-6">
                                    <Button title = "Submit Attendance" onClick = {submitAttendance} />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )}
    </>
    )
}

export default ViewClasses