import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Table from "../../components/Table";
import useAuthStore from "../../store/useAuthStore";

const SubjectsPage = () => {

    const navigate = useNavigate();

    const [subjects, setSubjects] = useState([]);

    const teacherId = useAuthStore((state) => state.user.user_id);

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const res = await API.get(`/teacher/getSubjects/${teacherId}`);
                setSubjects(res.data || []);
            } catch (err) {
                console.error(err);
                setSubjects([]);
            }
        };

        loadSubjects();
    }, []);

    return (
        <div className="bg-slate-100 min-h-screen p-6">

            <div className="bg-primary text-white p-6 rounded-xl shadow-md mb-6 flex justify-between">

                <div>
                    <h1 className="text-3xl font-bold">Subjects</h1>
                    <p className="text-slate-200">Manage all subjects</p>
                </div>

                <button
                    onClick={() => navigate(`/teacher`)}
                    className="hover:bg-tertiary px-4 py-2 rounded-md font-semibold transition"
                >
                    Go Back
                </button>

            </div>

                <Table
                    title="Subjects"
                    data={subjects}
                    getRowKey={(item) => item.subject_id}
                    columns={[
                        { label: "Subject ID", field: "subject_id" },
                        { label: "Subject Code", field: "subject_code" },
                        { label: "Subject Name", field: "subject_name" },
                        { label: "Description", field: "description" },
                    ]}
                />

        </div>
    );
};

export default SubjectsPage;