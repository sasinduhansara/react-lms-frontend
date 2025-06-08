import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";
import "./styles/LecturerDashboard.css";
import Navbar from "../../Components/WebPage/Navbar/Navbar";
import Navtabs from "../../Components/Lecturer/Navtabs/Navtabs";
import Footer from "../../Components/WebPage/Footer/Footer";

const LecturerDashboard = () => {
  // API Configuration
  const API_URL = "http://localhost:5000/api";

  // State for statistics cards
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalStudents: 0,
    totalMaterials: 0,
    totalLessons: 0,
  });

  // State for lecturer data
  const [lecturerData, setLecturerData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for modals and filters
  const [activeTab, setActiveTab] = useState("subjects");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    file: null,
    description: "",
  });
  const [uploading, setUploading] = useState(false);

  // Get auth token and lecturer info
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // Get current lecturer info
  const getCurrentLecturer = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  };

  // Auto-clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // ===================== API Functions =====================

  // Fetch lecturer's subjects
  const fetchLecturerSubjects = async () => {
    try {
      setLoading(true);
      const lecturer = getCurrentLecturer();
      if (!lecturer) {
        setError("Lecturer information not found");
        return;
      }

      const response = await axios.get(
        `${API_URL}/subjects/lecturer/${lecturer.userId}`,
        getAuthHeader()
      );
      setSubjects(response.data || []);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      setError("Failed to load subjects");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students enrolled in lecturer's subjects
  const fetchEnrolledStudents = async () => {
    try {
      setLoading(true);
      const lecturer = getCurrentLecturer();
      if (!lecturer) return;

      const response = await axios.get(
        `${API_URL}/students/lecturer/${lecturer.userId}`,
        getAuthHeader()
      );
      setStudents(response.data || []);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch lecturer's materials
  const fetchLecturerMaterials = async () => {
    try {
      setLoading(true);
      const lecturer = getCurrentLecturer();
      if (!lecturer) return;

      const response = await axios.get(
        `${API_URL}/materials/lecturer/${lecturer.userId}`,
        getAuthHeader()
      );
      setMaterials(response.data || []);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
      setError("Failed to load materials");
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch lecturer's lessons
  const fetchLecturerLessons = async () => {
    try {
      setLoading(true);
      const lecturer = getCurrentLecturer();
      if (!lecturer) return;

      const response = await axios.get(
        `${API_URL}/lessons/lecturer/${lecturer.userId}`,
        getAuthHeader()
      );
      setLessons(response.data || []);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      setError("Failed to load lessons");
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    setStats({
      totalSubjects: subjects.length,
      totalStudents: students.length,
      totalMaterials: materials.length,
      totalLessons: lessons.length,
    });
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      const lecturer = getCurrentLecturer();
      if (lecturer) {
        setLecturerData(lecturer);
        await Promise.all([
          fetchLecturerSubjects(),
          fetchEnrolledStudents(),
          fetchLecturerMaterials(),
          fetchLecturerLessons(),
        ]);
      } else {
        setError("Please login as a lecturer to access this dashboard");
      }
    };

    initializeData();
  }, []);

  // Calculate stats when data changes
  useEffect(() => {
    calculateStats();
  }, [subjects, students, materials, lessons]);

  // Filter materials by subject
  const filteredMaterials =
    subjectFilter === "all"
      ? materials
      : materials.filter((material) => material.subject === subjectFilter);

  return (
    <div className="lecturer-dashboard">
      <Navbar />
      <Navtabs />

      <div className="container-fluid">
        {/* Welcome Message */}
        {lecturerData && (
          <div className="welcome-message">
            <h2>
              Welcome, {lecturerData.firstName} {lecturerData.lastName}
            </h2>
            <p>Department: {lecturerData.department}</p>
          </div>
        )}

        {/* Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="row">
          {/* FIXED: Statistics Cards with proper icons */}
          <div className="stats-container">
            <div className="stat-card subject-stat">
              <div className="stat-icon">
                <i className="fas fa-book"></i>
              </div>
              <div className="stat-content">
                <h3>My Subjects</h3>
                <p className="stat-number">{stats.totalSubjects}</p>
                <small>Subjects I Teach</small>
              </div>
            </div>

            <div className="stat-card student-stat">
              <div className="stat-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div className="stat-content">
                <h3>My Students</h3>
                <p className="stat-number">{stats.totalStudents}</p>
                <small>Enrolled Students</small>
              </div>
            </div>

            <div className="stat-card material-stat">
              <div className="stat-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="stat-content">
                <h3>Materials</h3>
                <p className="stat-number">{stats.totalMaterials}</p>
                <small>Uploaded Materials</small>
              </div>
            </div>

            <div className="stat-card lesson-stat">
              <div className="stat-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <div className="stat-content">
                <h3>Lessons</h3>
                <p className="stat-number">{stats.totalLessons}</p>
                <small>Created Lessons</small>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3">
            <div className="dashboard-card">
              <div className="card-body">
                <nav className="tab-nav">
                  <a
                    href="#subjects"
                    className={`tab-link ${
                      activeTab === "subjects" ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("subjects");
                    }}
                  >
                    My Subjects
                  </a>
                  <a
                    href="#students"
                    className={`tab-link ${
                      activeTab === "students" ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("students");
                    }}
                  >
                    My Students
                  </a>
                  <a
                    href="#materials"
                    className={`tab-link ${
                      activeTab === "materials" ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("materials");
                    }}
                  >
                    Materials
                  </a>
                  <a
                    href="#lessons"
                    className={`tab-link ${
                      activeTab === "lessons" ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("lessons");
                    }}
                  >
                    Lessons
                  </a>
                </nav>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            {/* My Subjects Tab */}
            {activeTab === "subjects" && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h5>My Subjects</h5>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading subjects...</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Subject Code</th>
                          <th>Subject Name</th>
                          <th>Year/Semester</th>
                          <th>Credits</th>
                          <th>Students</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="empty-cell">
                              No subjects assigned
                            </td>
                          </tr>
                        ) : (
                          subjects.map((subject) => (
                            <tr key={subject._id}>
                              <td>{subject.subjectCode}</td>
                              <td>{subject.subjectName}</td>
                              <td>
                                Year {subject.year} - Sem {subject.semester}
                              </td>
                              <td>{subject.credits}</td>
                              <td>
                                {
                                  students.filter((s) =>
                                    s.subjects?.includes(subject._id)
                                  ).length
                                }
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* My Students Tab */}
            {activeTab === "students" && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h5>My Students</h5>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading students...</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Student ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Department</th>
                          <th>Enrolled Subjects</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="empty-cell">
                              No students found
                            </td>
                          </tr>
                        ) : (
                          students.map((student) => (
                            <tr key={student._id}>
                              <td>{student.userId}</td>
                              <td>
                                {student.firstName} {student.lastName}
                              </td>
                              <td>{student.email}</td>
                              <td>{student.department}</td>
                              <td>{student.subjects?.length || 0}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* Materials Tab - UPDATED: Removed Upload Material button */}
            {activeTab === "materials" && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h5>Course Materials</h5>
                  <div className="header-actions">
                    <select
                      value={subjectFilter}
                      onChange={(e) => setSubjectFilter(e.target.value)}
                      className="form-control"
                      style={{ width: "200px" }}
                    >
                      <option value="all">All Subjects</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.subjectCode} - {subject.subjectName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading materials...</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Subject</th>
                          <th>Type</th>
                          <th>Size</th>
                          <th>Upload Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMaterials.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="empty-cell">
                              No materials found
                            </td>
                          </tr>
                        ) : (
                          filteredMaterials.map((material) => (
                            <tr key={material._id}>
                              <td>{material.name}</td>
                              <td>
                                {
                                  subjects.find(
                                    (s) => s._id === material.subject
                                  )?.subjectCode
                                }
                              </td>
                              <td>{material.fileType?.toUpperCase()}</td>
                              <td>
                                {(material.fileSize / (1024 * 1024)).toFixed(2)}{" "}
                                MB
                              </td>
                              <td>
                                {new Date(
                                  material.createdAt
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                <a
                                  href={material.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-primary btn-sm"
                                >
                                  Download
                                </a>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* Lessons Tab */}
            {activeTab === "lessons" && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h5>My Lessons</h5>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading lessons...</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Subject</th>
                          <th>Progress</th>
                          <th>Status</th>
                          <th>Created Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lessons.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="empty-cell">
                              No lessons found
                            </td>
                          </tr>
                        ) : (
                          lessons.map((lesson) => (
                            <tr key={lesson._id}>
                              <td>{lesson.title}</td>
                              <td>
                                {
                                  subjects.find((s) => s._id === lesson.subject)
                                    ?.subjectCode
                                }
                              </td>
                              <td>
                                {lesson.uploadedParts || 0} /{" "}
                                {lesson.totalParts}
                              </td>
                              <td>
                                <span
                                  className={`badge badge-${
                                    lesson.status || "draft"
                                  }`}
                                >
                                  {lesson.status === "published"
                                    ? "Published"
                                    : "Draft"}
                                </span>
                              </td>
                              <td>
                                {new Date(
                                  lesson.createdAt
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LecturerDashboard;
