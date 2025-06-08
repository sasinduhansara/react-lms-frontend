import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Components/WebPage/Navbar/Navbar";
import Navtabs from "../../Components/Admin/Navtabs/Navtabs";
import Footer from "../../Components/WebPage/Footer/Footer";
import AdminLesson from "./AdminLesson";
import "./styles/AdminCourses.css";
import { supabase } from "../../utils/supabaseClient";

export default function AdminCourses() {
  // API base URL
  const API_URL = "http://localhost:5000/api";
  const supabaseUrl = "https://rttzoqbaodauytfqowhm.supabase.co";

  // Tab state
  const [activeTab, setActiveTab] = useState("departments");

  // Department states
  const [departments, setDepartments] = useState([]);
  const [departmentForm, setDepartmentForm] = useState({
    departmentId: "",
    name: "",
    description: "",
  });
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showDepartmentEditModal, setShowDepartmentEditModal] = useState(false);

  // Subject states
  const [subjects, setSubjects] = useState([]);
  const [subjectForm, setSubjectForm] = useState({
    subjectCode: "",
    subjectName: "",
    department: "",
    departmentId: "",
    year: 1,
    semester: 1,
    credits: "",
    description: "",
  });
  const [editingSubject, setEditingSubject] = useState(null);
  const [showSubjectEditModal, setShowSubjectEditModal] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    department: "all",
    year: "all",
    semester: "all",
  });

  // Material states
  const [materials, setMaterials] = useState([]);
  const [materialForm, setMaterialForm] = useState({
    name: "",
    file: null,
    fileType: "",
  });
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [showMaterialEditModal, setShowMaterialEditModal] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Department selection for material upload
  const [selectedDepartmentForMaterial, setSelectedDepartmentForMaterial] =
    useState(null);
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  // Filter state for materials
  const [materialFilter, setMaterialFilter] = useState({
    department: "",
    subject: "",
    searchQuery: "",
  });

  // Department selection effect
  useEffect(() => {
    if (selectedDepartmentForMaterial) {
      const filtered = subjects.filter(
        (subj) =>
          subj.departmentId === selectedDepartmentForMaterial.departmentId
      );
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects(subjects);
    }
  }, [selectedDepartmentForMaterial, subjects]);

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

  // Get auth token from localStorage
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

  // ===================== Department Functions =====================

  // Get all departments
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

  // Create new department
  const createDepartment = async (data) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.post(
        `${API_URL}/departments`,
        data,
        getAuthHeader()
      );
      setSuccess("Department created successfully!");
      return response.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create department";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Update department
  const updateDepartment = async (departmentId, data) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.put(
        `${API_URL}/departments/${departmentId}`,
        data,
        getAuthHeader()
      );
      setSuccess("Department updated successfully!");
      return response.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update department";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Delete department
  const deleteDepartment = async (departmentId) => {
    try {
      setLoading(true);
      setError("");
      await axios.delete(
        `${API_URL}/departments/${departmentId}`,
        getAuthHeader()
      );
      setSuccess("Department deleted successfully!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete department";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ===================== Subject Functions =====================

  // Get subjects with filters
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (filters.department !== "all") params.department = filters.department;
      if (filters.year !== "all") params.year = filters.year;
      if (filters.semester !== "all") params.semester = filters.semester;

      const response = await axios.get(`${API_URL}/subjects`, {
        ...getAuthHeader(),
        params,
      });
      setSubjects(response.data || []);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      setError(err.response?.data?.message || "Failed to load subjects");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new subject
  const createSubject = async (data) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.post(
        `${API_URL}/subjects`,
        data,
        getAuthHeader()
      );
      setSuccess("Subject created successfully!");
      return response.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create subject";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Update subject
  const updateSubject = async (subjectCode, data) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.put(
        `${API_URL}/subjects/${subjectCode}`,
        data,
        getAuthHeader()
      );
      setSuccess("Subject updated successfully!");
      return response.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update subject";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Delete subject
  const deleteSubject = async (id) => {
    try {
      setLoading(true);
      setError("");
      await axios.delete(`${API_URL}/subjects/${id}`, getAuthHeader());
      setSuccess("Subject deleted successfully!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete subject";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ===================== Material Functions =====================

  // Get all materials with proper subject lookup
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Get materials from your database
      const { data: dbMaterials } = await axios.get(
        `${API_URL}/materials`,
        getAuthHeader()
      );

      // 2. Get files from Supabase WITH metadata
      const { data: supabaseFiles, error } = await supabase.storage
        .from("materials")
        .list("", {
          limit: 100,
          include: ["metadata"],
        });

      if (error) throw error;

      // subject handling
      const combinedMaterials = (dbMaterials || []).map((dbMat) => {
        const filename = dbMat.path?.split("/").pop() || "";
        const fileInfo = supabaseFiles?.find((file) => file.name === filename);

        return {
          ...dbMat,
          url: `${supabaseUrl}/storage/v1/object/public/materials/${dbMat.path}`,
          type: dbMat.type || dbMat.path?.split(".").pop() || "unknown",
          size: fileInfo?.metadata?.size || dbMat.size || 0,
          lastModified:
            fileInfo?.metadata?.lastModified ||
            dbMat.updatedAt ||
            new Date(dbMat.createdAt).toLocaleDateString(),
        };
      });

      //console.log("Combined Materials:", combinedMaterials[0].subject);

      setMaterials(combinedMaterials);
    } catch (err) {
      console.error("Failed to load materials:", err);
      setError("Failed to load materials. Please try again.");
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  // Upload material with subject association
  const uploadMaterial = async (data) => {
    try {
      setLoading(true);
      setError("");

      if (!data.file) {
        throw new Error("No file selected");
      }

      // File size validation (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (data.file.size > maxSize) {
        throw new Error("File size exceeds 10MB limit");
      }

      // 1. First upload to Supabase
      const fileExt = data.file.name.split(".").pop()?.toLowerCase() || "";
      const fileName = `${
        data.subjectId
      }-${Date.now()}-${data.file.name.replace(/\s+/g, "-")}`;
      const filePath = `${fileExt}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("materials")
        .upload(filePath, data.file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("materials").getPublicUrl(filePath);

      // 3. Now send to your backend
      const response = await axios.post(
        `${API_URL}/materials`,
        {
          name: data.name || data.file.name,
          subject: data.subjectId,
          path: filePath,
          url: publicUrl,
          type: fileExt,
          size: data.file.size,
        },
        getAuthHeader()
      );

      setSuccess("Material uploaded successfully!");
      return response.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to upload material";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Download material
  const downloadMaterial = async (filePath) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("materials")
        .download(filePath);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = filePath.split("/").pop() || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess("File downloaded successfully!");
    } catch (err) {
      setError("Failed to download file: " + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update material (name and subject)
  const updateMaterial = async (id, updatedData) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.put(
        `${API_URL}/materials/${id}`,
        updatedData,
        getAuthHeader()
      );
      setSuccess("Material updated successfully!");
      return response.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update material";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Delete material
  const deleteMaterial = async (id, filePath) => {
    try {
      setLoading(true);
      setError("");

      // 1. Delete from Supabase storage
      const { error: storageError } = await supabase.storage
        .from("materials")
        .remove([filePath]);

      if (storageError) throw storageError;

      // 2. Delete from your database
      await axios.delete(`${API_URL}/materials/${id}`, getAuthHeader());
      setSuccess("Material deleted successfully!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete material";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ===================== Material Filtering =====================

  const getFilteredMaterials = () => {
    return materials.filter((material) => {
      // FIXED: Handle both string and object format for material.subject
      let materialSubjectId;
      if (typeof material.subject === "string") {
        materialSubjectId = material.subject;
      } else if (material.subject && material.subject._id) {
        materialSubjectId = material.subject._id;
      } else {
        materialSubjectId = null;
      }

      // Find the subject using the extracted ID
      const subject = subjects.find((s) => s._id === materialSubjectId);

      // Department filter
      const matchesDepartment =
        !materialFilter.department ||
        materialFilter.department === "" ||
        materialFilter.department === "all" ||
        (subject && subject.departmentId === materialFilter.department);

      // Subject filter
      const matchesSubject =
        !materialFilter.subject ||
        materialFilter.subject === "" ||
        materialFilter.subject === "all" ||
        materialSubjectId === materialFilter.subject;

      // Search filter
      const matchesSearch =
        !materialFilter.searchQuery ||
        materialFilter.searchQuery.trim() === "" ||
        material.name
          .toLowerCase()
          .includes(materialFilter.searchQuery.toLowerCase()) ||
        (subject &&
          subject.subjectName
            .toLowerCase()
            .includes(materialFilter.searchQuery.toLowerCase())) ||
        (subject &&
          subject.subjectCode
            .toLowerCase()
            .includes(materialFilter.searchQuery.toLowerCase()));

      return matchesDepartment && matchesSubject && matchesSearch;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setMaterialFilter({
      department: "",
      subject: "",
      searchQuery: "",
    });
  };

  // FIXED: Helper function to get subject name for material
  const getSubjectNameForMaterial = (material) => {
    const subject = subjects.find((s) => s._id === material.subject);
    if (subject) {
      return `${subject.subjectCode} - ${subject.subjectName}`;
    }
    return "N/A";
  };

  // ===================== Event Handlers =====================

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchDepartments(),
          fetchSubjects(),
          fetchMaterials(),
        ]);
      } catch (err) {
        console.error("Failed to initialize data:", err);
      }
    };

    initializeData();
  }, []);

  // Fetch subjects when filters change
  useEffect(() => {
    fetchSubjects();
  }, [filters]);

  // Handle department form submit
  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!departmentForm.departmentId.trim() || !departmentForm.name.trim()) {
      setError("Department ID and Name are required");
      return;
    }

    try {
      await createDepartment(departmentForm);
      setDepartmentForm({ departmentId: "", name: "", description: "" });
      await fetchDepartments();
    } catch (err) {
      // Error already handled in createDepartment
    }
  };

  // Handle department edit
  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setDepartmentForm({
      departmentId: department.departmentId,
      name: department.name,
      description: department.description || "",
    });
    setShowDepartmentEditModal(true);
  };

  // Handle department update
  const handleUpdateDepartment = async (e) => {
    e.preventDefault();

    if (!departmentForm.departmentId.trim() || !departmentForm.name.trim()) {
      setError("Department ID and Name are required");
      return;
    }

    try {
      await updateDepartment(editingDepartment.departmentId, departmentForm);
      setShowDepartmentEditModal(false);
      setEditingDepartment(null);
      await fetchDepartments();
    } catch (err) {
      // Error already handled in updateDepartment
    }
  };

  // Handle department delete
  const handleDepartmentDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this department? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteDepartment(id);
      await fetchDepartments();
    } catch (err) {
      // Error already handled in deleteDepartment
    }
  };

  // Handle subject form submit
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !subjectForm.subjectCode.trim() ||
      !subjectForm.subjectName.trim() ||
      !subjectForm.department
    ) {
      setError("Subject Code, Name, and Department are required");
      return;
    }

    try {
      const newSubject = await createSubject(subjectForm);
      setSubjectForm({
        subjectCode: "",
        subjectName: "",
        department: "",
        departmentId: "",
        year: 1,
        semester: 1,
        credits: 3,
        description: "",
      });
      setSubjects([...subjects, newSubject]);
      await fetchSubjects();
    } catch (err) {
      // Error already handled in createSubject
    }
  };

  // Handle subject edit
  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setSubjectForm({
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      department: subject.department,
      departmentId: subject.departmentId,
      year: subject.year,
      semester: subject.semester,
      credits: subject.credits,
      description: subject.description || "",
    });
    setShowSubjectEditModal(true);
  };

  // Handle subject update
  const handleUpdateSubject = async (e) => {
    e.preventDefault();

    if (
      !subjectForm.subjectCode.trim() ||
      !subjectForm.subjectName.trim() ||
      !subjectForm.department
    ) {
      setError("Subject Code, Name, and Department are required");
      return;
    }

    try {
      await updateSubject(editingSubject.subjectCode, subjectForm);
      setShowSubjectEditModal(false);
      setEditingSubject(null);
      await fetchSubjects();
    } catch (err) {
      // Error already handled in updateSubject
    }
  };

  // Handle subject delete
  const handleSubjectDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this subject? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteSubject(id);
      setSubjects(subjects.filter((s) => s._id !== id));
      await fetchSubjects();
    } catch (err) {
      // Error already handled in deleteSubject
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File size validation
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError("File size exceeds 10MB limit");
        e.target.value = "";
        return;
      }

      // Map file extensions to valid types
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      let fileType;

      if (ext === "pdf") fileType = "pdf";
      else if (["mp4", "mov", "avi", "mkv"].includes(ext)) fileType = "video";
      else if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
        fileType = "image";
      else if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext))
        fileType = "document";
      else fileType = "other";

      setMaterialForm({
        ...materialForm,
        file,
        fileType,
        name: materialForm.name || file.name.split(".")[0],
      });
    }
  };

  // Handle material upload
  const handleMaterialUpload = async () => {
    if (!materialForm.file) {
      setError("Please select a file");
      return;
    }

    if (!selectedSubject) {
      setError("Please select a subject");
      return;
    }

    try {
      const uploadedMaterial = await uploadMaterial({
        subjectId: selectedSubject,
        name: materialForm.name,
        file: materialForm.file,
      });

      setMaterials([...materials, uploadedMaterial]);
      setMaterialForm({ name: "", file: null, fileType: "" });
      setSelectedDepartmentForMaterial(null);
      setSelectedSubject(null);
      setShowMaterialModal(false);
      await fetchMaterials();
    } catch (err) {
      // Error already handled in uploadMaterial
    }
  };

  // Handle material download
  const handleDownload = async (filePath) => {
    try {
      await downloadMaterial(filePath);
    } catch (err) {
      // Error already handled in downloadMaterial
    }
  };

  // Handle material edit
  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setMaterialForm({
      name: material.name,
      file: null,
      fileType: material.type,
    });
    setSelectedSubject(material.subject);
    setShowMaterialEditModal(true);
  };

  // Handle material update
  const handleUpdateMaterial = async () => {
    if (!editingMaterial) return;

    if (!materialForm.name.trim()) {
      setError("Material name is required");
      return;
    }

    try {
      await updateMaterial(editingMaterial._id, {
        name: materialForm.name,
        subject: selectedSubject,
      });

      setShowMaterialEditModal(false);
      setEditingMaterial(null);
      await fetchMaterials();
    } catch (err) {
      // Error already handled in updateMaterial
    }
  };

  // Handle material delete
  const handleMaterialDelete = async (id, filePath) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this material? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteMaterial(id, filePath);
      setMaterials(materials.filter((m) => m._id !== id));
    } catch (err) {
      // Error already handled in deleteMaterial
    }
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "pdf":
        return "📄";
      case "video":
        return "🎬";
      case "image":
        return "🖼️";
      case "document":
        return "📝";
      default:
        return "📁";
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  // ===================== Render Functions =====================

  const renderDepartmentTab = () => (
    <div className="tab-content">
      <h2 className="section-title">Manage Departments</h2>

      {/* Message Display */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleDepartmentSubmit}>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Department ID (e.g., HNDIT)"
            value={departmentForm.departmentId}
            onChange={(e) =>
              setDepartmentForm({
                ...departmentForm,
                departmentId: e.target.value.toUpperCase(),
              })
            }
            required
            disabled={loading}
            maxLength={10}
          />
          <input
            type="text"
            placeholder="Department Name"
            value={departmentForm.name}
            onChange={(e) =>
              setDepartmentForm({ ...departmentForm, name: e.target.value })
            }
            required
            disabled={loading}
            maxLength={100}
          />
          <input
            type="text"
            placeholder="Description (Optional)"
            value={departmentForm.description}
            onChange={(e) =>
              setDepartmentForm({
                ...departmentForm,
                description: e.target.value,
              })
            }
            disabled={loading}
            maxLength={500}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Department"}
        </button>
      </form>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="loading-cell">
                  Loading...
                </td>
              </tr>
            ) : departments.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-cell">
                  No departments found
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept._id}>
                  <td>{dept.departmentId}</td>
                  <td>{dept.name}</td>
                  <td>{dept.description || "-"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEditDepartment(dept)}
                        className="btn-edit"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDepartmentDelete(dept.departmentId)
                        }
                        className="btn-delete"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Department Edit Modal */}
      {showDepartmentEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Department</h3>
              <button
                onClick={() => {
                  setShowDepartmentEditModal(false);
                  setEditingDepartment(null);
                }}
                className="modal-close-btn"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateDepartment}>
              <div className="form-group">
                <label>Department ID</label>
                <input
                  type="text"
                  value={departmentForm.departmentId}
                  onChange={(e) =>
                    setDepartmentForm({
                      ...departmentForm,
                      departmentId: e.target.value.toUpperCase(),
                    })
                  }
                  required
                  disabled={loading}
                  maxLength={10}
                />
              </div>

              <div className="form-group">
                <label>Department Name</label>
                <input
                  type="text"
                  value={departmentForm.name}
                  onChange={(e) =>
                    setDepartmentForm({
                      ...departmentForm,
                      name: e.target.value,
                    })
                  }
                  required
                  disabled={loading}
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={departmentForm.description}
                  onChange={(e) =>
                    setDepartmentForm({
                      ...departmentForm,
                      description: e.target.value,
                    })
                  }
                  disabled={loading}
                  maxLength={500}
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowDepartmentEditModal(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderSubjectTab = () => (
    <div className="tab-content">
      <h2 className="section-title">Manage Subjects</h2>

      {/* Message Display */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubjectSubmit}>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Subject Code (e.g., CS101)"
            value={subjectForm.subjectCode}
            onChange={(e) =>
              setSubjectForm({
                ...subjectForm,
                subjectCode: e.target.value.toUpperCase(),
              })
            }
            required
            disabled={loading}
            maxLength={10}
          />
          <input
            type="text"
            placeholder="Subject Name"
            value={subjectForm.subjectName}
            onChange={(e) =>
              setSubjectForm({ ...subjectForm, subjectName: e.target.value })
            }
            required
            disabled={loading}
            maxLength={100}
          />
          <select
            value={subjectForm.department}
            onChange={(e) => {
              const selectedDept = departments.find(
                (d) => d._id === e.target.value
              );
              setSubjectForm({
                ...subjectForm,
                department: e.target.value,
                departmentId: selectedDept?.departmentId || "",
              });
            }}
            required
            disabled={loading}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name} ({dept.departmentId})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Credits"
            min="1"
            max="10"
            value={subjectForm.credits}
            onChange={(e) =>
              setSubjectForm({
                ...subjectForm,
                credits: parseInt(e.target.value) || 1,
              })
            }
            required
            disabled={loading}
          />
        </div>

        <div className="form-grid">
          <select
            value={subjectForm.year}
            onChange={(e) =>
              setSubjectForm({ ...subjectForm, year: parseInt(e.target.value) })
            }
            disabled={loading}
          >
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
          <select
            value={subjectForm.semester}
            onChange={(e) =>
              setSubjectForm({
                ...subjectForm,
                semester: parseInt(e.target.value),
              })
            }
            disabled={loading}
          >
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
          <textarea
            placeholder="Description (Optional)"
            className="col-span-2"
            value={subjectForm.description}
            onChange={(e) =>
              setSubjectForm({ ...subjectForm, description: e.target.value })
            }
            disabled={loading}
            maxLength={500}
            rows={2}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={
            loading ||
            !subjectForm.subjectCode ||
            !subjectForm.subjectName ||
            !subjectForm.department
          }
        >
          {loading ? "Adding..." : "Add Subject"}
        </button>
      </form>

      {/* Filters */}
      <div className="filter-container">
        <div className="filter-group">
          <label>Department:</label>
          <select
            value={filters.department}
            onChange={(e) =>
              setFilters({ ...filters, department: e.target.value })
            }
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Year:</label>
          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            <option value="all">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Semester:</label>
          <select
            value={filters.semester}
            onChange={(e) =>
              setFilters({ ...filters, semester: e.target.value })
            }
          >
            <option value="all">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Department</th>
              <th>Year/Sem</th>
              <th>Credits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading-cell">
                  Loading...
                </td>
              </tr>
            ) : subjects.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">
                  No subjects found
                </td>
              </tr>
            ) : (
              subjects.map((subj) => {
                const dept = departments.find((d) => d._id === subj.department);
                return (
                  <tr key={subj._id}>
                    <td>{subj.subjectCode}</td>
                    <td>{subj.subjectName}</td>
                    <td>
                      {dept
                        ? `${dept.name} (${dept.departmentId})`
                        : subj.departmentId || "N/A"}
                    </td>
                    <td>
                      Year {subj.year} - Sem {subj.semester}
                    </td>
                    <td>{subj.credits}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEditSubject(subj)}
                          className="btn-edit"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleSubjectDelete(subj._id)}
                          className="btn-delete"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Subject Edit Modal */}
      {showSubjectEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Subject</h3>
              <button
                onClick={() => {
                  setShowSubjectEditModal(false);
                  setEditingSubject(null);
                }}
                className="modal-close-btn"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateSubject}>
              <div className="modal-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Subject Code</label>
                    <input
                      type="text"
                      value={subjectForm.subjectCode}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          subjectCode: e.target.value.toUpperCase(),
                        })
                      }
                      required
                      disabled={loading}
                      maxLength={10}
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject Name</label>
                    <input
                      type="text"
                      value={subjectForm.subjectName}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          subjectName: e.target.value,
                        })
                      }
                      required
                      disabled={loading}
                      maxLength={100}
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      value={subjectForm.department}
                      onChange={(e) => {
                        const selectedDept = departments.find(
                          (d) => d._id === e.target.value
                        );
                        setSubjectForm({
                          ...subjectForm,
                          department: e.target.value,
                          departmentId: selectedDept?.departmentId || "",
                        });
                      }}
                      required
                      disabled={loading}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name} ({dept.departmentId})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Credits</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={subjectForm.credits}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          credits: parseInt(e.target.value) || 1,
                        })
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Year</label>
                    <select
                      value={subjectForm.year}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          year: parseInt(e.target.value),
                        })
                      }
                      disabled={loading}
                    >
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <select
                      value={subjectForm.semester}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          semester: parseInt(e.target.value),
                        })
                      }
                      disabled={loading}
                    >
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                    </select>
                  </div>
                  <div className="form-group col-span-2">
                    <label>Description</label>
                    <textarea
                      value={subjectForm.description}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          description: e.target.value,
                        })
                      }
                      disabled={loading}
                      maxLength={500}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowSubjectEditModal(false)}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Subject"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderMaterialTab = () => (
    <div className="tab-content">
      <h2 className="section-title">Course Materials</h2>

      {/* Message Display */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* FIXED FILTER SECTION */}
      <div className="material-filters">
        <div className="filter-group">
          <label>Department:</label>
          <select
            value={materialFilter.department}
            onChange={(e) => {
              const deptId = e.target.value;
              setMaterialFilter({
                ...materialFilter,
                department: deptId,
                subject: "", // Reset subject when department changes
              });
            }}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.departmentId}>
                {dept.name} ({dept.departmentId})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Subject:</label>
          <select
            value={materialFilter.subject}
            onChange={(e) => {
              setMaterialFilter({
                ...materialFilter,
                subject: e.target.value,
              });
            }}
            disabled={!materialFilter.department}
          >
            <option value="">All Subjects</option>
            {subjects
              .filter(
                (subj) =>
                  !materialFilter.department ||
                  materialFilter.department === "all" ||
                  subj.departmentId === materialFilter.department
              )
              .map((subj) => (
                <option key={subj._id} value={subj._id}>
                  {subj.subjectCode} - {subj.subjectName}
                </option>
              ))}
          </select>
        </div>

        <div className="filter-group search-bar">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by material name, subject name, or subject code..."
            value={materialFilter.searchQuery}
            onChange={(e) => {
              setMaterialFilter({
                ...materialFilter,
                searchQuery: e.target.value,
              });
            }}
          />
        </div>

        <div className="filter-actions">
          <button
            onClick={clearAllFilters}
            className="btn-clear-filters"
            disabled={
              !materialFilter.department &&
              !materialFilter.subject &&
              !materialFilter.searchQuery
            }
          >
            Clear All Filters
          </button>
        </div>
      </div>

      <div className="materials-controls">
        <button
          onClick={() => {
            setSelectedDepartmentForMaterial(null);
            setSelectedSubject(null);
            setMaterialForm({ name: "", file: null, fileType: "" });
            setShowMaterialModal(true);
          }}
          className="btn-primary"
          disabled={loading}
        >
          + Add Material
        </button>
        <div className="materials-stats">
          <span>Total Materials: {materials.length}</span>
          <span>Filtered: {getFilteredMaterials().length}</span>
        </div>
      </div>

      {/* FIXED: Materials Table with subject name display */}
      <div className="materials-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Subject</th>
              <th>Size</th>
              <th>Last Modified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading-cell">
                  Loading...
                </td>
              </tr>
            ) : getFilteredMaterials().length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">
                  {materials.length === 0
                    ? "No materials found"
                    : "No materials match the current filters"}
                </td>
              </tr>
            ) : (
              getFilteredMaterials().map((mat) => {
                const lastModified = mat.lastModified
                  ? new Date(mat.lastModified).toLocaleDateString()
                  : "N/A";

                return (
                  <tr key={mat._id}>
                    <td className="material-name-cell">
                      <span className="file-icon">{getFileIcon(mat.type)}</span>
                      <span title={mat.name}>{mat.name}</span>
                    </td>
                    <td>{(mat.type || "unknown").toUpperCase()}</td>
                    <td>{mat.subject.subjectName}</td>
                    <td>{formatFileSize(mat.size)}</td>
                    <td>{lastModified}</td>
                    <td className="action-buttons">
                      <button
                        onClick={() => handleDownload(mat.path)}
                        className="btn-download"
                        disabled={loading}
                        title="Download file"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleEditMaterial(mat)}
                        className="btn-edit"
                        disabled={loading}
                        title="Edit material"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleMaterialDelete(mat._id, mat.path)}
                        className="btn-delete"
                        disabled={loading}
                        title="Delete material"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Material Upload Modal */}
      {showMaterialModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Upload New Material</h3>
              <button
                onClick={() => {
                  setShowMaterialModal(false);
                  setMaterialForm({ name: "", file: null, fileType: "" });
                  setSelectedDepartmentForMaterial(null);
                  setSelectedSubject(null);
                }}
                className="modal-close-btn"
              >
                &times;
              </button>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>Department *</label>
                <select
                  value={selectedDepartmentForMaterial?._id || ""}
                  onChange={(e) => {
                    const deptId = e.target.value;
                    const dept = departments.find((d) => d._id === deptId);
                    setSelectedDepartmentForMaterial(dept || null);
                    setSelectedSubject(null);
                  }}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name} ({dept.departmentId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <select
                  value={selectedSubject || ""}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={!selectedDepartmentForMaterial}
                  required
                >
                  <option value="">Select Subject</option>
                  {filteredSubjects.map((subj) => (
                    <option key={subj._id} value={subj._id}>
                      {subj.subjectCode} - {subj.subjectName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Material Name</label>
                <input
                  type="text"
                  placeholder="e.g., Lecture 1 Slides"
                  value={materialForm.name}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, name: e.target.value })
                  }
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label className="file-upload-label">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-upload-input"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.avi,.mkv"
                    required
                  />
                  <div className="file-upload-box">
                    {materialForm.file ? (
                      <>
                        <span className="file-icon-large">
                          {getFileIcon(materialForm.fileType)}
                        </span>
                        <div className="file-info">
                          <div className="file-name">
                            {materialForm.file.name}
                          </div>
                          <div className="file-size">
                            {formatFileSize(materialForm.file.size)}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="upload-instructions">
                        <span className="upload-icon">📤</span>
                        <p>Click to browse or drag and drop files</p>
                        <p className="file-types">
                          PDF, DOC, PPT, XLS, JPG, MP4, etc. (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => {
                    setShowMaterialModal(false);
                    setMaterialForm({ name: "", file: null, fileType: "" });
                    setSelectedDepartmentForMaterial(null);
                    setSelectedSubject(null);
                  }}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMaterialUpload}
                  className="btn-primary"
                  disabled={!materialForm.file || !selectedSubject || loading}
                >
                  {loading ? "Uploading..." : "Upload Material"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Material Edit Modal */}
      {showMaterialEditModal && editingMaterial && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Material: {editingMaterial.name}</h3>
              <button
                onClick={() => {
                  setShowMaterialEditModal(false);
                  setEditingMaterial(null);
                }}
                className="modal-close-btn"
              >
                &times;
              </button>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>Material Name *</label>
                <input
                  type="text"
                  value={materialForm.name}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, name: e.target.value })
                  }
                  required
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <select
                  value={selectedSubject || ""}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  required
                >
                  {subjects.map((subj) => (
                    <option key={subj._id} value={subj._id}>
                      {subj.subjectCode} - {subj.subjectName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Current File</label>
                <div className="current-file-info">
                  <span className="file-icon-large">
                    {getFileIcon(editingMaterial.type)}
                  </span>
                  <div className="file-details">
                    <div className="file-name">
                      {editingMaterial.path?.split("/").pop() || "Unknown file"}
                    </div>
                    <div className="file-meta">
                      Type: {(editingMaterial.type || "unknown").toUpperCase()}{" "}
                      | Size: {formatFileSize(editingMaterial.size)}
                    </div>
                  </div>
                  <a
                    href={editingMaterial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="current-file-link"
                  >
                    View File
                  </a>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => {
                    setShowMaterialEditModal(false);
                    setMaterialForm({ name: "", file: null, fileType: "" });
                    setEditingMaterial(null);
                  }}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateMaterial}
                  className="btn-primary"
                  disabled={loading || !materialForm.name.trim()}
                >
                  {loading ? "Updating..." : "Update Material"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ===================== Main Component Render =====================

  return (
    <div className="admin-courses-container">
      <Navbar />
      <Navtabs />

      <div className="admin-content">
        {/* UPDATED: Tab Navigation with Lessons tab */}
        <div className="courses-tab-nav">
          <button
            className={`tab-button ${
              activeTab === "departments" ? "active" : ""
            }`}
            onClick={() => setActiveTab("departments")}
          >
            Departments ({departments.length})
          </button>
          <button
            className={`tab-button ${activeTab === "subjects" ? "active" : ""}`}
            onClick={() => setActiveTab("subjects")}
          >
            Subjects ({subjects.length})
          </button>
          <button
            className={`tab-button ${
              activeTab === "materials" ? "active" : ""
            }`}
            onClick={() => setActiveTab("materials")}
          >
            Materials ({materials.length})
          </button>
          {/* ADDED: Lessons tab */}
          <button
            className={`tab-button ${activeTab === "lessons" ? "active" : ""}`}
            onClick={() => setActiveTab("lessons")}
          >
            Lessons
          </button>
        </div>

        {/* UPDATED: Tab Content with Lessons */}
        {activeTab === "departments" && renderDepartmentTab()}
        {activeTab === "subjects" && renderSubjectTab()}
        {activeTab === "materials" && renderMaterialTab()}
        {/* ADDED: Lessons tab content */}
        {activeTab === "lessons" && <AdminLesson />}
      </div>

      <Footer />
    </div>
  );
}
