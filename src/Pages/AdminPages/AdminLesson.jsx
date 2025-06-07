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
    type: "video", // video or pdf
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

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/lessons`, getAuthHeader());

      // Enhance lessons with subject info
      const enhancedLessons = (response.data || []).map((lesson) => {
        const subject = subjects.find((s) => s._id === lesson.subject);
        const department = departments.find((d) => d._id === lesson.department);

        return {
          ...lesson,
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
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonParts = async (lessonId) => {
    try {
      const response = await axios.get(
        `${API_URL}/lesson-parts/${lessonId}`,
        getAuthHeader()
      );
      setLessonParts(response.data || []);
    } catch (err) {
      console.error("Failed to fetch lesson parts:", err);
      setError("Failed to load lesson parts");
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchDepartments(), fetchSubjects()]);
    };
    initializeData();
  }, []);

  // Fetch lessons when subjects are loaded
  useEffect(() => {
    if (subjects.length > 0) {
      fetchLessons();
    }
  }, [subjects, departments]);

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
        type: "video",
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

  // Filter lessons
  const getFilteredLessons = () => {
    return lessons.filter((lesson) => {
      const matchesDepartment =
        !filters.department || lesson.department === filters.department;
      const matchesSubject =
        !filters.subject || lesson.subject === filters.subject;
      const matchesSearch =
        !filters.searchQuery ||
        lesson.title
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        lesson.description
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase());

      return matchesDepartment && matchesSubject && matchesSearch;
    });
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File size validation
      const maxSize =
        lessonForm.type === "video" ? 500 * 1024 * 1024 : 50 * 1024 * 1024; // 500MB for video, 50MB for PDF
      if (file.size > maxSize) {
        setError(
          `File size exceeds ${
            lessonForm.type === "video" ? "500MB" : "50MB"
          } limit`
        );
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

      {/* Filters */}
      <div className="lesson-filters">
        <div className="filter-group">
          <label>Department:</label>
          <select
            value={filters.department}
            onChange={(e) =>
              setFilters({
                ...filters,
                department: e.target.value,
                subject: "",
              })
            }
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
            onChange={(e) =>
              setFilters({ ...filters, subject: e.target.value })
            }
            disabled={!filters.department}
          >
            <option value="">All Subjects</option>
            {subjects
              .filter(
                (subj) =>
                  !filters.department || subj.department === filters.department
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
              <th>Type</th>
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
                <td colSpan="7" className="loading-cell">
                  Loading...
                </td>
              </tr>
            ) : getFilteredLessons().length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-cell">
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
                  <td>
                    <span className={`type-badge ${lesson.type}`}>
                      {lesson.type === "video" ? "🎬 Video" : "📄 PDF"}
                    </span>
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
                      setLessonForm({
                        ...lessonForm,
                        department: e.target.value,
                        subject: "",
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
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, subject: e.target.value })
                    }
                    disabled={!lessonForm.department}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects
                      .filter(
                        (subj) => subj.department === lessonForm.department
                      )
                      .map((subj) => (
                        <option key={subj._id} value={subj._id}>
                          {subj.subjectCode} - {subj.subjectName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Lesson Type *</label>
                  <select
                    value={lessonForm.type}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, type: e.target.value })
                    }
                  >
                    <option value="video">🎬 Video Lesson</option>
                    <option value="pdf">📄 PDF Lesson</option>
                  </select>
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
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={
                    lessonForm.type === "video" ? ".mp4,.mov,.avi,.mkv" : ".pdf"
                  }
                  required
                />
                <small>
                  Supported formats:{" "}
                  {lessonForm.type === "video"
                    ? "MP4, MOV, AVI, MKV (Max 500MB)"
                    : "PDF (Max 50MB)"}
                </small>
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

      {/* Parts List Modal */}
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
              {lessonParts.length === 0 ? (
                <div className="empty-parts">No parts uploaded yet</div>
              ) : (
                lessonParts.map((part, index) => (
                  <div key={part._id} className="part-item">
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
                      <p>File Type: {part.fileType?.toUpperCase()}</p>
                      <p>Questions: {part.questions?.length || 0}</p>
                      <p>
                        Uploaded:{" "}
                        {new Date(part.createdAt).toLocaleDateString()}
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
