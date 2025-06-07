import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";
import "./styles/AdminLesson.css";

export default function AdminLesson() {
  const API_URL = "http://localhost:5000/api";
  const supabaseUrl = "https://rttzoqbaodauytfqowhm.supabase.co";

  // States
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    department: "",
    subject: "",
    totalParts: 1,
  });

  // Part upload states
  const [partForm, setPartForm] = useState({
    lessonId: "",
    partNumber: 1,
    title: "",
    file: null,
    fileType: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      },
    ],
  });

  // Modal states
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);
  const [showPartsListModal, setShowPartsListModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonParts, setLessonParts] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    department: "",
    subject: "",
    searchQuery: "",
  });

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

  // Fetch functions
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/departments`,
        getAuthHeader()
      );
      setDepartments(response.data || []);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setError("Failed to load departments");
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/subjects`, getAuthHeader());
      setSubjects(response.data || []);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      setError("Failed to load subjects");
    }
  };

  // FIXED: Fetch lessons after departments and subjects are loaded
  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/lessons`, getAuthHeader());

      // FIXED: Handle different response structures
      let lessonsData = [];

      if (response.data.success) {
        // If response has success property, data is in response.data.data
        lessonsData = response.data.data || [];
      } else if (Array.isArray(response.data)) {
        // If response.data is directly an array
        lessonsData = response.data;
      } else {
        // If response.data is an object, try to find the array
        lessonsData = response.data.lessons || response.data.data || [];
      }

      console.log("Lessons data:", lessonsData); // Debug log
      console.log("Departments for mapping:", departments); // Debug log
      console.log("Subjects for mapping:", subjects); // Debug log

      // FIXED: Enhance lessons with subject info only if departments and subjects are loaded
      const enhancedLessons = lessonsData.map((lesson) => {
        // FIXED: Handle both string and object IDs for department
        let departmentId = lesson.department;
        if (typeof lesson.department === "object" && lesson.department._id) {
          departmentId = lesson.department._id;
        }

        // FIXED: Handle both string and object IDs for subject
        let subjectId = lesson.subject;
        if (typeof lesson.subject === "object" && lesson.subject._id) {
          subjectId = lesson.subject._id;
        }

        const subject = subjects.find((s) => s._id === subjectId);
        const department = departments.find((d) => d._id === departmentId);

        console.log("Mapping lesson:", lesson.title);
        console.log("Looking for department ID:", departmentId);
        console.log("Found department:", department);
        console.log("Looking for subject ID:", subjectId);
        console.log("Found subject:", subject);

        return {
          ...lesson,
          // Store original IDs for filtering
          departmentId: departmentId,
          subjectId: subjectId,
          subjectName: subject
            ? `${subject.subjectCode} - ${subject.subjectName}`
            : "Unknown Subject",
          departmentName: department ? department.name : "Unknown Department",
        };
      });

      setLessons(enhancedLessons);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      setError("Failed to load lessons");
      setLessons([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Fetch lesson parts with proper error handling
  const fetchLessonParts = async (lessonId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/lesson-parts/${lessonId}`,
        getAuthHeader()
      );

      console.log("Lesson parts response:", response.data); // Debug log

      // FIXED: Handle different response structures
      let partsData = [];

      if (response.data.success) {
        // If response has success property, data is in response.data.data
        partsData = response.data.data || [];
      } else if (Array.isArray(response.data)) {
        // If response.data is directly an array
        partsData = response.data;
      } else {
        // If response.data is an object, try to find the array
        partsData = response.data.parts || response.data.data || [];
      }

      setLessonParts(partsData);
    } catch (err) {
      console.error("Failed to fetch lesson parts:", err);
      setError("Failed to load lesson parts");
      setLessonParts([]); // FIXED: Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchDepartments(), fetchSubjects()]);
    };
    initializeData();
  }, []);

  // FIXED: Fetch lessons only after both departments and subjects are loaded
  useEffect(() => {
    if (departments.length > 0 && subjects.length > 0) {
      fetchLessons();
    }
  }, [departments, subjects]);

  // FIXED: Get filtered subjects based on selected department - CORRECTED COMPARISON
  const getFilteredSubjectsForForm = () => {
    if (!lessonForm.department) return [];
    console.log("Selected department:", lessonForm.department);
    console.log("All subjects:", subjects);

    const filtered = subjects.filter((subject) => {
      // FIXED: Compare with subject.department._id instead of subject.department
      const subjectDeptId = subject.department?._id || subject.department;
      console.log("Comparing:", subjectDeptId, "with", lessonForm.department);
      return subjectDeptId === lessonForm.department;
    });

    console.log("Filtered subjects for form:", filtered);
    return filtered;
  };

  // FIXED: Get filtered subjects for filter dropdown - CORRECTED COMPARISON
  const getFilteredSubjectsForFilter = () => {
    if (!filters.department) return subjects;
    return subjects.filter((subject) => {
      const subjectDeptId = subject.department?._id || subject.department;
      return subjectDeptId === filters.department;
    });
  };

  // Create lesson
  const handleCreateLesson = async (e) => {
    e.preventDefault();

    if (
      !lessonForm.title.trim() ||
      !lessonForm.department ||
      !lessonForm.subject
    ) {
      setError("Title, Department, and Subject are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/lessons`,
        {
          ...lessonForm,
          status: "draft",
          uploadedParts: 0,
          createdAt: new Date().toISOString(),
        },
        getAuthHeader()
      );

      setSuccess("Lesson created successfully!");
      setLessonForm({
        title: "",
        description: "",
        department: "",
        subject: "",
        totalParts: 1,
      });
      setShowLessonModal(false);
      await fetchLessons();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  // Upload lesson part
  const handleUploadPart = async () => {
    if (!partForm.file || !partForm.title.trim()) {
      setError("File and title are required");
      return;
    }

    if (partForm.questions.some((q) => !q.question.trim())) {
      setError("All questions must have content");
      return;
    }

    try {
      setLoading(true);

      // Upload file to Supabase
      const fileExt = partForm.file.name.split(".").pop()?.toLowerCase() || "";
      const fileName = `${partForm.lessonId}-part-${
        partForm.partNumber
      }-${Date.now()}.${fileExt}`;
      const filePath = `lessons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("lessons")
        .upload(filePath, partForm.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("lessons").getPublicUrl(filePath);

      // Save part data to backend
      const partData = {
        lessonId: partForm.lessonId,
        partNumber: partForm.partNumber,
        title: partForm.title,
        filePath: filePath,
        fileUrl: publicUrl,
        fileType: fileExt,
        fileSize: partForm.file.size,
        questions: partForm.questions.filter((q) => q.question.trim() !== ""),
        isLocked: partForm.partNumber > 1, // First part is unlocked, others are locked
        createdAt: new Date().toISOString(),
      };

      await axios.post(`${API_URL}/lesson-parts`, partData, getAuthHeader());

      // Update lesson's uploaded parts count
      await axios.put(
        `${API_URL}/lessons/${partForm.lessonId}/increment-parts`,
        {},
        getAuthHeader()
      );

      setSuccess("Lesson part uploaded successfully!");
      setPartForm({
        lessonId: "",
        partNumber: 1,
        title: "",
        file: null,
        fileType: "",
        questions: [
          {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
            explanation: "",
          },
        ],
      });
      setShowPartModal(false);
      await fetchLessons();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload lesson part");
    } finally {
      setLoading(false);
    }
  };

  // Add question
  const addQuestion = () => {
    setPartForm({
      ...partForm,
      questions: [
        ...partForm.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
        },
      ],
    });
  };

  // Remove question
  const removeQuestion = (index) => {
    const newQuestions = partForm.questions.filter((_, i) => i !== index);
    setPartForm({ ...partForm, questions: newQuestions });
  };

  // Update question
  const updateQuestion = (questionIndex, field, value) => {
    const newQuestions = [...partForm.questions];
    if (field === "question") {
      newQuestions[questionIndex].question = value;
    } else if (field === "explanation") {
      newQuestions[questionIndex].explanation = value;
    } else if (field === "correctAnswer") {
      newQuestions[questionIndex].correctAnswer = parseInt(value);
    } else if (field.startsWith("option")) {
      const optionIndex = parseInt(field.split("-")[1]);
      newQuestions[questionIndex].options[optionIndex] = value;
    }
    setPartForm({ ...partForm, questions: newQuestions });
  };

  // FIXED: Filter lessons with proper ID comparison
  const getFilteredLessons = () => {
    return lessons.filter((lesson) => {
      console.log("Filtering lesson:", lesson.title);
      console.log("Lesson department ID:", lesson.departmentId);
      console.log("Filter department:", filters.department);
      console.log("Lesson subject ID:", lesson.subjectId);
      console.log("Filter subject:", filters.subject);

      const matchesDepartment =
        !filters.department || lesson.departmentId === filters.department;
      const matchesSubject =
        !filters.subject || lesson.subjectId === filters.subject;
      const matchesSearch =
        !filters.searchQuery ||
        lesson.title
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        lesson.description
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase());

      console.log("Matches department:", matchesDepartment);
      console.log("Matches subject:", matchesSubject);
      console.log("Matches search:", matchesSearch);

      return matchesDepartment && matchesSubject && matchesSearch;
    });
  };

  // UPDATED: Handle file change - Accept any file type
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // UPDATED: Increased file size limit to 100MB for all file types
      const maxSize = 100 * 1024 * 1024; // 100MB for all files
      if (file.size > maxSize) {
        setError("File size exceeds 100MB limit");
        e.target.value = "";
        return;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      setPartForm({
        ...partForm,
        file,
        fileType: ext,
      });
    }
  };

  // Delete lesson
  const handleDeleteLesson = async (lessonId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this lesson? This will also delete all its parts."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/lessons/${lessonId}`, getAuthHeader());
      setSuccess("Lesson deleted successfully!");
      await fetchLessons();
    } catch (err) {
      setError("Failed to delete lesson");
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Get file type display
  const getFileTypeDisplay = (fileType) => {
    if (!fileType) return "📁 File";

    const type = fileType.toLowerCase();
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(type)) return "🎬 Video";
    if (["pdf"].includes(type)) return "📄 PDF";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(type)) return "🖼️ Image";
    if (["doc", "docx"].includes(type)) return "📝 Document";
    if (["ppt", "pptx"].includes(type)) return "📊 Presentation";
    if (["xls", "xlsx"].includes(type)) return "📈 Spreadsheet";
    if (["zip", "rar", "7z"].includes(type)) return "🗜️ Archive";
    return "📁 File";
  };

  return (
    <div className="admin-lesson-container">
      <div className="lesson-header">
        <h2>Manage Lessons</h2>
        <button
          className="btn-primary"
          onClick={() => setShowLessonModal(true)}
          disabled={loading}
        >
          + Create New Lesson
        </button>
      </div>

      {/* Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* FIXED: Filters with proper subject filtering */}
      <div className="lesson-filters">
        <div className="filter-group">
          <label>Department:</label>
          <select
            value={filters.department}
            onChange={(e) => {
              console.log("Department filter changed to:", e.target.value);
              setFilters({
                ...filters,
                department: e.target.value,
                subject: "", // Reset subject when department changes
              });
            }}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Subject:</label>
          <select
            value={filters.subject}
            onChange={(e) => {
              console.log("Subject filter changed to:", e.target.value);
              setFilters({ ...filters, subject: e.target.value });
            }}
            disabled={!filters.department}
          >
            <option value="">All Subjects</option>
            {getFilteredSubjectsForFilter().map((subj) => (
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
            placeholder="Search lessons..."
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters({ ...filters, searchQuery: e.target.value })
            }
          />
        </div>
      </div>

      {/* Lessons Table */}
      <div className="lessons-table-container">
        <table className="lessons-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Subject</th>
              <th>Progress</th>
              <th>Status</th>
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
            ) : getFilteredLessons().length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">
                  No lessons found
                </td>
              </tr>
            ) : (
              getFilteredLessons().map((lesson) => (
                <tr key={lesson._id}>
                  <td className="lesson-title">
                    <div className="title-main">{lesson.title}</div>
                    {lesson.description && (
                      <div className="title-desc">{lesson.description}</div>
                    )}
                  </td>
                  <td>{lesson.departmentName}</td>
                  <td>{lesson.subjectName}</td>
                  <td>
                    <div className="progress-info">
                      <span className="progress-text">
                        {lesson.uploadedParts || 0} / {lesson.totalParts}
                      </span>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${
                              ((lesson.uploadedParts || 0) /
                                lesson.totalParts) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${lesson.status || "draft"}`}
                    >
                      {lesson.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button
                      className="btn-upload"
                      onClick={() => {
                        setPartForm({
                          ...partForm,
                          lessonId: lesson._id,
                          partNumber: (lesson.uploadedParts || 0) + 1,
                        });
                        setShowPartModal(true);
                      }}
                      disabled={
                        loading || lesson.uploadedParts >= lesson.totalParts
                      }
                      title="Upload next part"
                    >
                      Upload Part
                    </button>
                    <button
                      className="btn-view"
                      onClick={() => {
                        setSelectedLesson(lesson);
                        fetchLessonParts(lesson._id);
                        setShowPartsListModal(true);
                      }}
                      disabled={loading}
                      title="View all parts"
                    >
                      View Parts
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteLesson(lesson._id)}
                      disabled={loading}
                      title="Delete lesson"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Lesson Modal */}
      {showLessonModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Lesson</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowLessonModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="modal-form">
              <div className="form-group">
                <label>Lesson Title *</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, title: e.target.value })
                  }
                  placeholder="Enter lesson title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={lessonForm.description}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter lesson description"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={lessonForm.department}
                    onChange={(e) => {
                      console.log("Department changed to:", e.target.value);
                      setLessonForm({
                        ...lessonForm,
                        department: e.target.value,
                        subject: "", // Reset subject when department changes
                      });
                    }}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <select
                    value={lessonForm.subject}
                    onChange={(e) => {
                      console.log("Subject changed to:", e.target.value);
                      setLessonForm({ ...lessonForm, subject: e.target.value });
                    }}
                    disabled={!lessonForm.department}
                    required
                  >
                    <option value="">Select Subject</option>
                    {getFilteredSubjectsForForm().map((subj) => (
                      <option key={subj._id} value={subj._id}>
                        {subj.subjectCode} - {subj.subjectName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Total Parts *</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={lessonForm.totalParts}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      totalParts: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowLessonModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Part Modal */}
      {showPartModal && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>Upload Lesson Part {partForm.partNumber}</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowPartModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>Part Title *</label>
                <input
                  type="text"
                  value={partForm.title}
                  onChange={(e) =>
                    setPartForm({ ...partForm, title: e.target.value })
                  }
                  placeholder="Enter part title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Upload File *</label>
                <input type="file" onChange={handleFileChange} required />
                <small>Supported formats: All file types (Max 100MB)</small>
                {partForm.file && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px",
                    }}
                  >
                    <strong>Selected file:</strong> {partForm.file.name}
                    <br />
                    <strong>Type:</strong>{" "}
                    {getFileTypeDisplay(partForm.fileType)}
                    <br />
                    <strong>Size:</strong>{" "}
                    {(partForm.file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                )}
              </div>

              {/* Questions Section */}
              <div className="questions-section">
                <div className="questions-header">
                  <h4>Questions for this Part</h4>
                  <button
                    type="button"
                    className="btn-add-question"
                    onClick={addQuestion}
                  >
                    + Add Question
                  </button>
                </div>

                {partForm.questions.map((question, qIndex) => (
                  <div key={qIndex} className="question-item">
                    <div className="question-header">
                      <h5>Question {qIndex + 1}</h5>
                      {partForm.questions.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-question"
                          onClick={() => removeQuestion(qIndex)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Question *</label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) =>
                          updateQuestion(qIndex, "question", e.target.value)
                        }
                        placeholder="Enter your question"
                        required
                      />
                    </div>

                    <div className="options-grid">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="option-item">
                          <label className="option-label">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correctAnswer === oIndex}
                              onChange={() =>
                                updateQuestion(qIndex, "correctAnswer", oIndex)
                              }
                            />
                            Option {oIndex + 1} (Correct)
                          </label>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateQuestion(
                                qIndex,
                                `option-${oIndex}`,
                                e.target.value
                              )
                            }
                            placeholder={`Option ${oIndex + 1}`}
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div className="form-group">
                      <label>Explanation (Optional)</label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) =>
                          updateQuestion(qIndex, "explanation", e.target.value)
                        }
                        placeholder="Explain why this is the correct answer"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowPartModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleUploadPart}
                  disabled={loading || !partForm.file || !partForm.title}
                >
                  {loading ? "Uploading..." : "Upload Part"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FIXED: Parts List Modal with proper array handling */}
      {showPartsListModal && selectedLesson && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>Parts for: {selectedLesson.title}</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowPartsListModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="parts-list">
              {/* FIXED: Check if lessonParts is array and has length */}
              {!Array.isArray(lessonParts) || lessonParts.length === 0 ? (
                <div className="empty-parts">No parts uploaded yet</div>
              ) : (
                lessonParts.map((part, index) => (
                  <div key={part._id || index} className="part-item">
                    <div className="part-header">
                      <h4>
                        Part {part.partNumber}: {part.title}
                      </h4>
                      <span
                        className={`lock-status ${
                          part.isLocked ? "locked" : "unlocked"
                        }`}
                      >
                        {part.isLocked ? "🔒 Locked" : "🔓 Unlocked"}
                      </span>
                    </div>
                    <div className="part-details">
                      <p>File Type: {getFileTypeDisplay(part.fileType)}</p>
                      <p>Questions: {part.questions?.length || 0}</p>
                      <p>
                        Uploaded:{" "}
                        {part.createdAt
                          ? new Date(part.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowPartsListModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
