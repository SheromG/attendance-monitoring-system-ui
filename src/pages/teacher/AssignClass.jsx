import { useState, useEffect } from "react";
import API from "../../services/api";
import Modal from "../../components/Modal";
import useShake from "../../components/useShake";
import emptyValidation from "../../utils/emptyValidation";

const AssignClass = ({ discard, teacherId }) => {
  const [form, setForm] = useState({
    teacherId: "",
    sectionId: "",
    subjectId: "",
    semester: "",
  });

  const [teachers, setTeachers] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { shake, triggerShake } = useShake();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherData, sectionData, subjectData] = await Promise.all([
          API.get("/teacher/getTeachers"),
          API.get("/teacher/sections"),
          API.get(`/teacher/getSubjects/${teacherId}`),
      ]);

        setTeachers(teacherData.data);
        setSections(sectionData.data);
        setSubjects(subjectData.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

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

      await API.post("/teacher/classes", {
        teacher_id: form.teacherId,
        section_id: form.sectionId,
        subject_id: form.subjectId,
        semester: Number(form.semester),
      });

      Modal.success("Class Created Successfully");

      setForm({
        teacherId: "",
        sectionId: "",
        subjectId: "",
        semester: "",
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
        teacherId: !form.teacherId,
        sectionId: !form.sectionId,
        subjectId: !form.subjectId,
        semester: !form.semester,
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
          teacherId: "",
          sectionId: "",
          subjectId: "",
          semester: "",
        });

        setErrors({});
      }
  }, [discard]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-custom">
      <h2 className="text-xl font-bold text-primary mb-4">
        Assign Class
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <select
          name="teacherId"
          value={form.teacherId}
          onChange={handleChange}
          className={ emptyValidation({ field:"teacherId", errors, shake })}
        >
          <option value="">Select Teacher</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.user_id}>
              {t.firstName} {t.lastName}
            </option>
          ))}
        </select>
        { errors.teacherId && <p className="text-red-500 text-sm mt-1">Teacher is required</p> }

        <select
          name="sectionId"
          value={form.sectionId}
          onChange={handleChange}
          className={ emptyValidation({ field:"sectionId", errors, shake })}
        >
          <option value="">Select Section</option>
          {sections.map((s) => (
            <option key={s.section_id} value={s.section_id}>
              {s.section_name}
            </option>
          ))}
        </select>
        { errors.sectionId && <p className="text-red-500 text-sm mt-1">Section is required</p> }

        <select
          name="subjectId"
          value={form.subjectId}
          onChange={handleChange}
          className={ emptyValidation({ field:"subjectId", errors, shake })}
      >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub.subject_id} value={sub.subject_id}>
              {sub.subject_code} - {sub.subject_name}
            </option>
          ))}
        </select>
        { errors.subjectId && <p className="text-red-500 text-sm mt-1">Subject is required</p> }

        <select
          name="semester"
          value={form.semester}
          onChange={handleChange}
          className={ emptyValidation({ field:"semester", errors, shake })}
        >
          <option value="">Select Semester</option>
          <option value="1">1st Semester</option>
          <option value="2">2nd Semester</option>
        </select>
        { errors.semester && <p className="text-red-500 text-sm mt-1"> Semester is required</p> }

        <button
          disabled={loading}
          className="bg-primary w-40 text-white py-2 rounded-md hover:bg-tertiary transition"
        >
          {loading ? "Saving..." : "Save Class"}
        </button>

      </form>
    </div>
  );
};

export default AssignClass;