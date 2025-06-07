import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";
import "./styles/AdminDashboard.css";
import Navbar from "../../Components/WebPage/Navbar/Navbar";
import Navtabs from "../../Components/Admin/Navtabs/Navtabs";
import Footer from "../../Components/WebPage/Footer/Footer";

const AdminDashboard = () => {
  // API Configuration
  const API_URL = "http://localhost:5000/api";

  // State for statistics cards
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalStudents: 0,
    totalLecturers: 0,
    totalDepartments: 0,
    totalUsers: 0,
  });

  // State for user management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for news management
  const [news, setNews] = useState([]);

  // State for course management
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);

  // State for modals and filters
  const [activeTab, setActiveTab] = useState("users");
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userDeptFilter, setUserDeptFilter] = useState("all");
  const [courseDeptFilter, setCourseDeptFilter] = useState("all");
  const [newNews, setNewNews] = useState({
    title: "",
    content: "",
    image: null,
    imageFile: null,
  });
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showCourseDeptDropdown, setShowCourseDeptDropdown] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Get auth token
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

  // ===================== Supabase Functions =====================

  // Upload image to Supabase Storage
  const uploadImageToSupabase = async (file) => {
    try {
      setUploading(true);

      // Validate file
      if (!file) {
        throw new Error("No file selected");
      }

      // File size validation (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("File size exceeds 5MB limit");
      }

      // Get file extension
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const allowedTypes = ["jpg", "jpeg", "png", "gif", "webp"];

      if (!allowedTypes.includes(fileExt)) {
        throw new Error("Only JPG, PNG, GIF, and WebP files are allowed");
      }

      // Create unique filename
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      // Determine folder based on file type
      let folder = "images"; // default
      if (fileExt === "png") folder = "png";
      else if (["jpg", "jpeg"].includes(fileExt)) folder = "jpg";

      const filePath = `${folder}/${fileName}`;

      console.log("Uploading to Supabase:", {
        bucket: "news-images",
        path: filePath,
        size: file.size,
        type: file.type,
      });

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log("Upload successful:", data);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("news-images").getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error("Failed to get public URL");
      }

      console.log("Public URL generated:", publicUrl);

      return {
        imageUrl: publicUrl,
        imagePath: filePath,
      };
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Delete image from Supabase Storage
  const deleteImageFromSupabase = async (imagePath) => {
    try {
      if (!imagePath) return;

      const { error } = await supabase.storage
        .from("news-images")
        .remove([imagePath]);

      if (error) {
        console.error("Error deleting image:", error);
      } else {
        console.log("Image deleted successfully:", imagePath);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // ===================== API Functions =====================

  // Fetch all users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}/users`, getAuthHeader());
      setUsers(response.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.response?.data?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments from backend
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${API_URL}/departments`,
        getAuthHeader()
      );
      setDepartments(response.data || []);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setError(err.response?.data?.message || "Failed to load departments");
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch news from backend
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/news`, getAuthHeader());

      if (response.data.success) {
        setNews(response.data.data || []);
      } else {
        setNews(response.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError(err.response?.data?.error || "Failed to load news");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate students count per department
  const getStudentsCountForDepartment = (departmentId) => {
    return users.filter(
      (user) => user.role === "student" && user.department === departmentId
    ).length;
  };

  // Fetch subjects/courses from backend
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/subjects`, getAuthHeader());

      // Transform subjects data to match course structure
      const coursesData = (response.data || []).map((subject) => ({
        id: subject._id,
        code: subject.subjectCode,
        title: subject.subjectName,
        department: subject.departmentId || "N/A",
        students: getStudentsCountForDepartment(subject.departmentId),
        credits: subject.credits || 0,
        year: subject.year || 1,
        semester: subject.semester || 1,
        description: subject.description || "",
      }));

      setCourses(coursesData);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError(err.response?.data?.message || "Failed to load courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics from backend
  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/users/stats`,
        getAuthHeader()
      );
      const statsData = response.data;

      // Calculate totals from backend response
      const adminCount = statsData.roles?.admin || 0;
      const studentCount = statsData.roles?.student || 0;
      const lecturerCount = statsData.roles?.lecturer || 0;
      const departmentCount =
        statsData.departments?.length || departments.length || 5;
      const totalUsers = adminCount + studentCount + lecturerCount;

      console.log("Stats from API:", statsData);

      setStats({
        totalAdmins: adminCount,
        totalStudents: studentCount,
        totalLecturers: lecturerCount,
        totalDepartments: departmentCount,
        totalUsers: totalUsers,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      calculateStatsFromUsers();
    }
  };

  // Calculate statistics from users array (fallback method)
  const calculateStatsFromUsers = () => {
    if (users.length === 0) return;

    const adminCount = users.filter((user) => user.role === "admin").length;
    const studentCount = users.filter((user) => user.role === "student").length;
    const lecturerCount = users.filter(
      (user) => user.role === "lecturer"
    ).length;
    const uniqueDepartments = [
      ...new Set(users.map((user) => user.department).filter((dept) => dept)),
    ];
    const departmentCount = departments.length || uniqueDepartments.length || 5;
    const totalUsers = adminCount + studentCount + lecturerCount;

    setStats({
      totalAdmins: adminCount,
      totalStudents: studentCount,
      totalLecturers: lecturerCount,
      totalDepartments: departmentCount,
      totalUsers: totalUsers,
    });
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([fetchUsers(), fetchDepartments(), fetchNews()]);
        await fetchStats();
      } catch (err) {
        console.error("Failed to initialize data:", err);
      }
    };

    initializeData();
  }, []);

  // Fetch courses after users are loaded
  useEffect(() => {
    if (users.length > 0) {
      fetchCourses();
      calculateStatsFromUsers();
    }
  }, [users, departments]);

  // Get unique departments from users and departments
  const userDepartments = [
    ...new Set(users.map((user) => user.department).filter((dept) => dept)),
  ];

  // Get course departments from departments data
  const courseDepartments = [
    ...new Set(departments.map((dept) => dept.departmentId)),
  ];

  // Filter users by role and department
  const filteredUsers = users.filter((user) => {
    const roleMatch = userRoleFilter === "all" || user.role === userRoleFilter;
    const deptMatch =
      userDeptFilter === "all" || user.department === userDeptFilter;
    return roleMatch && deptMatch;
  });

  // Filter courses by department using departmentId
  const filteredCourses =
    courseDeptFilter === "all"
      ? courses
      : courses.filter((course) => course.department === courseDeptFilter);

  // ===================== News Functions =====================

  // Handle news image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store file for later upload
    setNewNews({
      ...newNews,
      imageFile: file,
    });

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewNews((prev) => ({
        ...prev,
        image: event.target.result,
        imageFile: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Add new news to backend
  const addNews = async () => {
    try {
      setLoading(true);
      let imageUrl = "";
      let imagePath = "";

      // Upload image to Supabase if file exists
      if (newNews.imageFile) {
        try {
          const uploadResult = await uploadImageToSupabase(newNews.imageFile);
          imageUrl = uploadResult.imageUrl;
          imagePath = uploadResult.imagePath;
          setSuccess("Image uploaded successfully!");
        } catch (uploadError) {
          setError("Image upload failed: " + uploadError.message);
          return;
        }
      }

      // Create news data
      const newsData = {
        title: newNews.title,
        description: newNews.content,
        imageUrl: imageUrl,
        imagePath: imagePath,
      };

      console.log("Creating news with data:", newsData);

      // Send to backend
      const response = await axios.post(
        `${API_URL}/news`,
        newsData,
        getAuthHeader()
      );

      if (response.data.success) {
        setSuccess("News created successfully!");
        setShowNewsModal(false);
        setNewNews({ title: "", content: "", image: null, imageFile: null });

        // Refresh news list
        await fetchNews();
      }
    } catch (error) {
      console.error("Error creating news:", error);
      setError(error.response?.data?.error || "Failed to create news");

      // If news creation failed but image was uploaded, delete the image
      if (newNews.imagePath) {
        await deleteImageFromSupabase(newNews.imagePath);
      }
    } finally {
      setLoading(false);
    }
  };

  // Edit news in backend
  const editNews = async () => {
    try {
      setLoading(true);
      let imageUrl = selectedNews.imageUrl;
      let imagePath = selectedNews.imagePath;

      // Upload new image if file exists
      if (newNews.imageFile) {
        try {
          // Delete old image if exists
          if (selectedNews.imagePath) {
            await deleteImageFromSupabase(selectedNews.imagePath);
          }

          // Upload new image
          const uploadResult = await uploadImageToSupabase(newNews.imageFile);
          imageUrl = uploadResult.imageUrl;
          imagePath = uploadResult.imagePath;
          setSuccess("Image updated successfully!");
        } catch (uploadError) {
          setError("Image upload failed: " + uploadError.message);
          return;
        }
      }

      // Create news data
      const newsData = {
        title: newNews.title,
        description: newNews.content,
        imageUrl: imageUrl,
        imagePath: imagePath,
      };

      console.log("Updating news with data:", newsData);

      // Send to backend
      const response = await axios.put(
        `${API_URL}/news/${selectedNews.title}`,
        newsData,
        getAuthHeader()
      );

      if (response.data.success) {
        setSuccess("News updated successfully!");
        setShowNewsModal(false);
        setSelectedNews(null);
        setNewNews({ title: "", content: "", image: null, imageFile: null });

        // Refresh news list
        await fetchNews();
      }
    } catch (error) {
      console.error("Error updating news:", error);
      setError(error.response?.data?.error || "Failed to update news");
    } finally {
      setLoading(false);
    }
  };

  // Delete news from backend
  const deleteNews = async (newsTitle) => {
    if (!window.confirm("Are you sure you want to delete this news?")) {
      return;
    }

    try {
      setLoading(true);

      // Find the news item to get image path
      const newsItem = news.find((item) => item.title === newsTitle);

      // Delete from backend
      const response = await axios.delete(
        `${API_URL}/news/${newsTitle}`,
        getAuthHeader()
      );

      if (response.data.success) {
        // Delete image from Supabase if exists
        if (newsItem?.imagePath) {
          await deleteImageFromSupabase(newsItem.imagePath);
        }

        setSuccess("News deleted successfully!");

        // Refresh news list
        await fetchNews();
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      setError(error.response?.data?.error || "Failed to delete news");
    } finally {
      setLoading(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowRoleDropdown(false);
      setShowDeptDropdown(false);
      setShowCourseDeptDropdown(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="admin-dashboard">
      <Navbar />
      <Navtabs />

      <div className="container-fluid">
        {/* Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="row">
          {/* Enhanced Statistics Cards */}
          <div className="stats-container">
            <div className="stat-card admin-stat">
              <div className="stat-icon">
                <i className="fas fa-user-shield"></i>
              </div>
              <div className="stat-content">
                <h3>Total Admins</h3>
                <p className="stat-number">{stats.totalAdmins}</p>
                <small>System Administrators</small>
              </div>
            </div>

            <div className="stat-card student-stat">
              <div className="stat-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div className="stat-content">
                <h3>Total Students</h3>
                <p className="stat-number">{stats.totalStudents}</p>
                <small>Enrolled Students</small>
              </div>
            </div>

            <div className="stat-card lecturer-stat">
              <div className="stat-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <div className="stat-content">
                <h3>Total Lecturers</h3>
                <p className="stat-number">{stats.totalLecturers}</p>
                <small>Teaching Staff</small>
              </div>
            </div>

            <div className="stat-card department-stat">
              <div className="stat-icon">
                <i className="fas fa-building"></i>
              </div>
              <div className="stat-content">
                <h3>Total Departments</h3>
                <p className="stat-number">{stats.totalDepartments}</p>
                <small>Academic Departments</small>
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
                    href="#users"
                    className={`tab-link ${
                      activeTab === "users" ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("users");
                    }}
                  >
                    User Management
                  </a>
                  <a
                    href="#news"
                    className={`tab-link ${
                      activeTab === "news" ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("news");
                    }}
                  >
                    News Management
                  </a>
                  <a
                    href="#courses"
                    className={`tab-link ${
                      activeTab === "courses" ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("courses");
                    }}
                  >
                    Course Management
                  </a>
                  <a
                    href="#reports"
                    className={`tab-link ${
                      activeTab === "reports" ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("reports");
                    }}
                  >
                    Reports
                  </a>
                </nav>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            {/* User Management Tab */}
            {activeTab === "users" && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h5>User Management</h5>
                  <div className="filter-container">
                    {/* Role Filter Dropdown */}
                    <div className="filter-dropdown">
                      <button
                        className={`dropdown-toggle ${
                          userRoleFilter === "all" ? "" : "outline"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRoleDropdown(!showRoleDropdown);
                        }}
                      >
                        {userRoleFilter === "all"
                          ? "All Roles"
                          : userRoleFilter}
                        <span>▼</span>
                      </button>
                      <div
                        className={`dropdown-menu ${
                          showRoleDropdown ? "show" : ""
                        }`}
                      >
                        <div
                          className={`dropdown-item ${
                            userRoleFilter === "all" ? "active" : ""
                          }`}
                          onClick={() => {
                            setUserRoleFilter("all");
                            setShowRoleDropdown(false);
                          }}
                        >
                          All Roles
                        </div>
                        <div
                          className={`dropdown-item ${
                            userRoleFilter === "admin" ? "active" : ""
                          }`}
                          onClick={() => {
                            setUserRoleFilter("admin");
                            setShowRoleDropdown(false);
                          }}
                        >
                          Admins
                        </div>
                        <div
                          className={`dropdown-item ${
                            userRoleFilter === "lecturer" ? "active" : ""
                          }`}
                          onClick={() => {
                            setUserRoleFilter("lecturer");
                            setShowRoleDropdown(false);
                          }}
                        >
                          Lecturers
                        </div>
                        <div
                          className={`dropdown-item ${
                            userRoleFilter === "student" ? "active" : ""
                          }`}
                          onClick={() => {
                            setUserRoleFilter("student");
                            setShowRoleDropdown(false);
                          }}
                        >
                          Students
                        </div>
                      </div>
                    </div>

                    {/* Department Filter Dropdown */}
                    <div className="filter-dropdown">
                      <button
                        className={`dropdown-toggle ${
                          userDeptFilter === "all" ? "" : "outline"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeptDropdown(!showDeptDropdown);
                        }}
                      >
                        {userDeptFilter === "all"
                          ? "All Departments"
                          : userDeptFilter}
                        <span>▼</span>
                      </button>
                      <div
                        className={`dropdown-menu ${
                          showDeptDropdown ? "show" : ""
                        }`}
                      >
                        <div
                          className={`dropdown-item ${
                            userDeptFilter === "all" ? "active" : ""
                          }`}
                          onClick={() => {
                            setUserDeptFilter("all");
                            setShowDeptDropdown(false);
                          }}
                        >
                          All Departments
                        </div>
                        {userDepartments.map((dept) => (
                          <div
                            key={dept}
                            className={`dropdown-item ${
                              userDeptFilter === dept ? "active" : ""
                            }`}
                            onClick={() => {
                              setUserDeptFilter(dept);
                              setShowDeptDropdown(false);
                            }}
                          >
                            {dept}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading users...</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Department</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="empty-cell">
                              No users found
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((user) => (
                            <tr key={user._id || user.userId}>
                              <td>{user.userId}</td>
                              <td>
                                {user.firstName} {user.lastName}
                              </td>
                              <td>{user.email}</td>
                              <td>
                                <span className={`badge badge-${user.role}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td>{user.department || "N/A"}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* News Management Tab - Enhanced with Supabase */}
            {activeTab === "news" && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h5>News Management</h5>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedNews(null);
                      setNewNews({
                        title: "",
                        content: "",
                        image: null,
                        imageFile: null,
                      });
                      setShowNewsModal(true);
                    }}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Add News"}
                  </button>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading news...</p>
                    </div>
                  ) : (
                    <div className="news-grid">
                      {news.length === 0 ? (
                        <div className="empty-cell">No news found</div>
                      ) : (
                        news.map((item) => (
                          <div key={item._id} className="news-card">
                            <img
                              src={item.imageUrl || "/default-news.jpg"}
                              alt={item.title}
                              className="news-image"
                              onError={(e) => {
                                e.target.src = "/default-news.jpg";
                              }}
                            />
                            <div className="news-content">
                              <h5>{item.title}</h5>
                              <p>{item.description}</p>
                              <small>
                                By: {item.author} | Posted:{" "}
                                {new Date(item.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                            <div className="news-actions">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => {
                                  setSelectedNews(item);
                                  setNewNews({
                                    title: item.title,
                                    content: item.description,
                                    image: item.imageUrl,
                                    imageFile: null,
                                  });
                                  setShowNewsModal(true);
                                }}
                                disabled={loading}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => deleteNews(item.title)}
                                disabled={loading}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Course Management Tab */}
            {activeTab === "courses" && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h5>Course Management</h5>
                  <div className="filter-dropdown">
                    <button
                      className="dropdown-toggle"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCourseDeptDropdown(!showCourseDeptDropdown);
                      }}
                    >
                      {courseDeptFilter === "all"
                        ? "All Departments"
                        : courseDeptFilter}
                      <span>▼</span>
                    </button>
                    <div
                      className={`dropdown-menu ${
                        showCourseDeptDropdown ? "show" : ""
                      }`}
                    >
                      <div
                        className={`dropdown-item ${
                          courseDeptFilter === "all" ? "active" : ""
                        }`}
                        onClick={() => {
                          setCourseDeptFilter("all");
                          setShowCourseDeptDropdown(false);
                        }}
                      >
                        All Departments
                      </div>
                      {courseDepartments.map((dept) => (
                        <div
                          key={dept}
                          className={`dropdown-item ${
                            courseDeptFilter === dept ? "active" : ""
                          }`}
                          onClick={() => {
                            setCourseDeptFilter(dept);
                            setShowCourseDeptDropdown(false);
                          }}
                        >
                          {dept}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading courses...</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Course Code</th>
                          <th>Title</th>
                          <th>Department</th>
                          <th>Students</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="empty-cell">
                              No courses found
                            </td>
                          </tr>
                        ) : (
                          filteredCourses.map((course) => (
                            <tr key={course.id}>
                              <td>{course.code}</td>
                              <td>{course.title}</td>
                              <td>{course.department}</td>
                              <td>{course.students}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div className="dashboard-card">
                <div className="card-body">
                  <h5>Reports</h5>
                  <p>Reports content would go here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Add/Edit News Modal with Supabase Integration */}
      {showNewsModal && (
        <div className="modal show">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedNews ? "Edit News" : "Add News"}</h3>
              <button
                className="modal-close"
                onClick={() => setShowNewsModal(false)}
                disabled={loading || uploading}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newNews.title}
                  onChange={(e) =>
                    setNewNews({ ...newNews, title: e.target.value })
                  }
                  required
                  disabled={loading || uploading}
                />
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={newNews.content}
                  onChange={(e) =>
                    setNewNews({ ...newNews, content: e.target.value })
                  }
                  required
                  disabled={loading || uploading}
                />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={loading || uploading}
                />
                <small className="form-text text-muted">
                  Supported formats: JPG, PNG, GIF, WebP (Max: 5MB)
                </small>
                {newNews.image && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={newNews.image}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxHeight: "200px", maxWidth: "100%" }}
                    />
                  </div>
                )}
              </div>
              {uploading && (
                <div className="upload-progress">
                  <div className="loading-spinner"></div>
                  <span>Uploading image...</span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowNewsModal(false)}
                disabled={loading || uploading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={selectedNews ? editNews : addNews}
                disabled={
                  !newNews.title || !newNews.content || loading || uploading
                }
              >
                {loading
                  ? "Saving..."
                  : uploading
                  ? "Uploading..."
                  : selectedNews
                  ? "Save Changes"
                  : "Add News"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AdminDashboard;
