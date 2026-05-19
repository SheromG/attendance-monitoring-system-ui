import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import API from "../../services/api";
import Card from "../../components/Card";
import Button from "../../components/Button";
import CreateSection from "./CreateSection";
import EnrollStudent from "./EnrollStudents";
import CreateUser from "./CreateUser";
import CreateSubject from "./CreateSubject";
import CreateSchedule from "./CreateSchedule";
import AssignClass from "./AssignClass";

const TeacherDashboard = (props) => {

    const teacherId = useAuthStore((state) => state.user?.user_id);

    const logout = useAuthStore((state) => state.logout);

    const [stats, setStats] = useState({
        sections: 0,
        classes: 0,
        students: 0,
        subjects: 0,
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await API.get(`/teacher/stats/${teacherId}`);
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        loadStats();
    }, [teacherId])

    const [sections, setSections] = useState(false);
    const [classes, setClasses] = useState(false);
    const [students, setStudents] = useState(false);
    const [user, setUser] = useState(false);
    const [subject, setSubject] = useState(false);
    const [schedule, setSchedule] = useState(false);
    const [discard, setDiscard] = useState(false);

    const handleDiscard = () => {
        if (!discard) {
            setDiscard(true);
            return;
        }

        setSections(false);
        setClasses(false);
        setStudents(false);
        setUser(false);
        setSubject(false);
        setSchedule(false);
        setDiscard(false);
    };

    return (
        <div className="flex min-h-screen bg-slate-100 font-main">
            <div className="flex-1 ">
                <div className="bg-primary text-white p-6 shadow-md flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">AMS Teacher Dashboard</h1>
                        <p className="text-slate-200"> Attendance Monitoring System</p>
                    </div>
                    <Button title = "Log Out" isRed = {true}   onClick = {() => logout() }  />
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card role = { props.role } title="Sections" data ={stats.sections} />
                    <Card role = { props.role } title="Classes" data ={stats.classes} />
                    <Card role = { props.role } title="Subjects" data ={stats.subjects} />
                    <Card role = { props.role } title="Students" data ={stats.students} />
                </div>
                <div className="px-6 mt-6 pb-6">
                {
                    sections || classes || user || students || subject || schedule 
                    ?
                    <div className="bg-white p-6 mb-6 rounded-xl flex">
                        {
                            !discard 
                            ?
                            <Button title = "Discard Changes" isRed = {true} value = {discard}  onClick = {handleDiscard} />
                            :
                            <div className="flex gap-6 items-center">
                                <p className="font-bold text-primary"> Are you sure?</p>
                                <Button title = "Yes" isRed = {true} onClick = {handleDiscard} />
                                <Button title = "No" onClick = {() => setDiscard(false)} />
                            </div>
                        }
                        
                    </div>
                    :
                    <div className="bg-white p-6 mb-6 rounded-xl ">
                        <h2 className="text-xl font-bold text-primary mb-4 "> Quick Actions</h2>
                        <div className="flex flex-wrap gap-4 ">
                            <Button title = "Add Users" value = {user} function = {setUser} />
                            <Button title = "Create Section" value = {sections} function = {setSections} />
                            <Button title = "Create Subject" value = {subject} function = {setSubject} />
                            <Button title = "Assign Schedule" value = {schedule} function = {setSchedule} />
                            <Button title = "Assign Class" value = {classes} function = {setClasses} />
                            <Button title = "Enroll Students" value = {students} function = {setStudents} />
                        </div>
                    </div>
                }
                
                { sections && <CreateSection discard = { discard } /> }
                { classes && <AssignClass  discard = { discard } teacherId = {teacherId} /> }
                { subject && <CreateSubject  discard = { discard } /> }
                { schedule && <CreateSchedule discard = { discard } /> }
                { user && <CreateUser discard = { discard } /> }
                { students && <EnrollStudent discard = { discard }/>}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;