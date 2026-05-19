# Attendance Monitoring System - Frontend

A web-based frontend for managing student attendance using React, Tailwind CSS, and Zustand.

---
## 👤 Author

- 👨‍💻 Sherom Granada  
- 🔗 GitHub: https://github.com/SheromG  
- 📧 Portfolio: https://portfolio-sheromgranada.vercel.app/
- 💼 Role: Full Stack Developer
---

## 🚀 Tech Stack
- React.js
- Tailwind CSS
- Zustand (State Management)
- Axios

---

## 📌 Features

### 👨‍🏫 Teacher
- Login
- Dashboard overview
- Manage sections
- Manage classes/subjects
- Assign class schedules
- Enroll students
- View student lists per class
- View attendance records
- Generate reports (UI-ready) // Not yet implemented

### 🎓 Student
- Login
- View enrolled classes
- View schedules
- Submit attendance
- View attendance history

---

## 🧭 Pages Structure

### Teacher Pages
- Dashboard
- Section Management
- Class Management
- Subject Management
- Schedule Management
- Student Enrollment
- Attendance Reports

### Student Pages
- Dashboard
- Schedule Page
- Submit Attendance Page
- Attendance History Page

---

## 🔁 Frontend Flow

Login → Store User Data (Zustand) → Token Authentication → Navigation → API Requests → Backend Response → UI Render

---

## 🔐 Authentication
- JWT-based authentication
- Role-based routing (Teacher / Student)
- Protected routes for secure pages

---

## 📦 Setup

```bash
npm install
npm run dev