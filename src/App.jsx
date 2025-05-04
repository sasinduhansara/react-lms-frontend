import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebPage from "./Pages/WebPage";
import LoginPage from "./Pages/LoginPage";
import Student from "./Pages/Student";
import Lecturer from "./Pages/Lecturer";
import Admin from "./Pages/Admin";


function App() {
  return (
   
      <Routes>
        <Route path="/" element={<WebPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/lecturer" element={<Lecturer />} />
        <Route path="/student" element={<Student />} />
        <Route path="/admin" element={<Admin />} />
      
      </Routes>

  );
}

export default App;
