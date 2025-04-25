import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebPage from "./Pages/WebPage";
import LoginPage from "./Pages/LoginPage";


function App() {
  return (
   
      <Routes>
        <Route path="/" element={<WebPage />} />
        <Route path="/login" element={<LoginPage />} />
      
      </Routes>

  );
}

export default App;
