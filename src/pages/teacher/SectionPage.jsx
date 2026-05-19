import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import useAuthStore from "../../store/useAuthStore";
import { formatSemester } from "../../formats/semester.jsx";
import { formatYearLevel } from "../../formats/yearLevel.jsx";
import Table from "../../components/Table.jsx";

const SectionsPage = () => {

    const navigate = useNavigate();

    const teacherId = useAuthStore((state) => state.user.user_id);

    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        const loadSections = async () => {
            try {
                const res = await API.get(`/teacher/getSectionsWithClasses/${teacherId}`);

                const groupedSections = [];

                res.data.forEach((row) => {

                    let section = groupedSections.find( (s) => s.section_id === row.section_id );

                    if (!section)
                        groupedSections.push(
                            (section = {
                                section_id: row.section_id,
                                section_name: row.section_name,
                                year_level: row.year_level,
                                school_year: row.school_year,
                                classes: [],
                            })
                        );

                    if ( row.class_id && !section.classes.some((c) => c.class_id === row.class_id))
                        section.classes.push({
                            class_id: row.class_id,
                            subject_name: row.subject_name,
                            semester: row.semester,
                        });

                });

                setSections(groupedSections);

            } catch (err) {
                console.error(err);
                setSections([]);
            }
        };

        loadSections();
    }, [teacherId]);


    return (
        <div className="bg-slate-100 min-h-screen p-6">

            <div className="bg-primary text-white p-6 rounded-xl shadow-md mb-6 flex justify-between">

                <div>
                    <h1 className="text-3xl font-bold">Sections</h1>
                    <p className="text-slate-200">Manage all sections</p>
                </div>

                <button
                    onClick={() => navigate(`/teacher`)}
                    className="hover:bg-tertiary px-4 py-2 rounded-md font-semibold transition"
                >
                    Go Back
                </button>

            </div>

            <Table
                title="Sections"
                data={sections}
                getRowKey={(item) => item.section_id}
                onRowClick={(item) => setSelectedSection(item)}
                columns={[
                    { label: "Section Name", field: "section_name" },
                    { label: "Year Level", field: "year_level" },
                    { label: "School Year", field: "school_year" },
                ]}
            />

            {selectedSection && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

                    <div className="bg-white w-full max-w-4xl rounded-xl p-6">

                        <div className="flex justify-between mb-6">

                            <div>
                                <h2 className="text-2xl font-bold text-primary">
                                    {selectedSection.section_name}
                                </h2>

                                <p className="text-slate-500">
                                    {formatYearLevel(selectedSection.year_level)} - {selectedSection.school_year}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedSection(null)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Close
                            </button>

                        </div>

                        <h3 className="text-xl font-bold mb-3">
                            Classes
                        </h3>

                        <table className="w-full border-collapse">

                            <thead>
                                <tr className="bg-tertiary text-white">
                                    <th className="p-3 border">Subject</th>
                                    <th className="p-3 border">Semester</th>
                                </tr>
                            </thead>

                            <tbody>
                                {selectedSection?.classes.length > 0 ? (
                                    selectedSection.classes.map((c) => (
                                        <tr key={c.class_id}>
                                            <td className="p-3 border text-center">{c.subject_name}</td>
                                            <td className="p-3 border text-center">
                                                {formatSemester(c.semester)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center p-4 text-slate-500">
                                            No classes found
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

export default SectionsPage;