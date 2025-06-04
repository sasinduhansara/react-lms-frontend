import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebPage from "./Pages/WebPage";
import LoginPage from "./Pages/LoginPage";
import Student from "./Pages/StudentPages/StudentHome";
import Lecturer from "./Pages/LecturerPages/LecturerHome";
import Admin from "./Pages/AdminPages/AdminHome";
import AdminUsers from './Pages/AdminPages/AdminUsers';
import AdminCourses from './Pages/AdminPages/AdminCourses';
import AdminNotification from './Pages/AdminPages/AdminNotification';
import AdminDashboard from './Pages/AdminPages/AdminDashboard';
import AdminMarks from './Pages/AdminPages/AdminMarks';
import AdminSetting from './Pages/AdminPages/AdminSetting';

function App() {
  return (
   
      <Routes>
        <Route path="/" element={<WebPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/lecturer" element={<Lecturer />} />
        <Route path="/student" element={<Student />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/notification" element={<AdminNotification />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/marks" element={<AdminMarks />} />
        <Route path="/admin/setting" element={<AdminSetting />} />
      
      </Routes>

  );
}

export default App;
