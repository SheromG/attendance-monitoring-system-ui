import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import API from "../../services/api";
import BooleanCard from "../../components/BooleanCard";
import Button from "../../components/Button";
import ViewClasses from "./ViewClasses";
import ViewAttendance from "./ViewAttendance";
import ViewProfile from "./ViewProfile";

const StudentDashboard = (props) => {

    const studentId = useAuthStore((state) => state.user?.user_id);

    const logout = useAuthStore((state) => state.logout);

    const [stats, setStats] = useState({
        classes: 0,
        attendance: 0,
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await API.get(`/student/stats/${studentId}`);
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        loadStats();
    }, [studentId]);

    const [activeTab, setActiveTab] = useState();
    const [submit, setSubmit] = useState(false);
    
    return (
        <div className="flex min-h-screen bg-slate-100 font-main">
            <div className="flex-1 ">
                <div className="bg-primary text-white p-6 shadow-md flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">AMS Student Dashboard</h1>
                        <p className="text-slate-200"> Attendance Monitoring System</p>
                    </div>
                    <Button title = "Log Out" isRed = {true}   onClick = {() => logout() }  />
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <BooleanCard
                        title="Classes"
                        data={stats.classes}
                        value={activeTab === "classes"}
                        onClick={() => setActiveTab("classes")}
                    />

                    <BooleanCard
                        title="Attendance"
                        data={stats.attendance}
                        value={activeTab === "attendance"}
                        onClick={() => setActiveTab("attendance")}
                    />

                    <BooleanCard
                        title="Profile"
                        value={activeTab === "profile"}
                        onClick={() => setActiveTab("profile")}
                    />

                </div>

                <div className="px-6 ">
                    { activeTab === "classes" && <ViewClasses  studentId = {studentId} /> }
                    { activeTab === "attendance" && <ViewAttendance  studentId = {studentId} /> }
                    { activeTab === "profile" && <ViewProfile /> }
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard