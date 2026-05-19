import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import useAuthStore from "./store/useAuthStore";
import { checkTokenExpiry } from "./services/checkTokenService";

import ProtectedRoute from "./utils/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

import ClassesPage from "./pages/teacher/ClassesPage";
import SectionsPage from "./pages/teacher/SectionPage";
import SubjectsPage from "./pages/teacher/SubjectsPage";
import StudentsPage from "./pages/teacher/StudentsPage";

import NotFound from "./pages/NotFound";

const App = () => {
  const navigate = useNavigate();

  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);

  useEffect(() => { checkTokenExpiry(); }, []);

  useEffect(() => { if (!token) navigate("/");}, [token, navigate]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboard role="teacher"/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/Classes"
        element={
          <ProtectedRoute role="teacher">
            <ClassesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/Sections"
        element={
          <ProtectedRoute role="teacher">
            <SectionsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/Subjects"
        element={
          <ProtectedRoute role="teacher">
            <SubjectsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/Students"
        element={
          <ProtectedRoute role="teacher">
            <StudentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;