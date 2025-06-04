import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/WebPage/Navbar/Navbar';
import Navtabs from '../../Components/Admin/Navtabs/Navtabs';
import Footer from '../../Components/WebPage/Footer/Footer';
import './styles/AdminCourses.css';
import axios from 'axios';

export default function AdminCourses() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('departments');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Department form states
  const [departmentId, setDepartmentId] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [description, setDescription] = useState('');
  const [departments, setDepartments] = useState([]);
  const [role] = useState('admin');
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/departments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  // Add department
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!departmentId.trim() || !departmentName.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newDepartment = {
      departmentId: departmentId.trim(),
      name: departmentName.trim(),
      description: description.trim() || undefined,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Sending department data:', newDepartment);
      console.log('Token exists:', !!token);
      
      const result = await axios.post('http://localhost:5000/api/departments', newDepartment, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Department added successfully:', result.data);
      
      // Add to local state
      setDepartments(prev => [...prev, result.data]);
      
      // Reset form
      setDepartmentId('');
      setDepartmentName('');
      setDescription('');
      setShowAddModal(false);
      
      alert('Department added successfully.');
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Invalid data format';
        alert(`Bad Request (400): ${errorMessage}\n\nPlease check:\n- Department ID format\n- Required fields\n- Data validation rules`);
      } else if (error.response?.status === 401) {
        alert('Unauthorized: Please log in again');
      } else if (error.response?.status === 403) {
        alert('Forbidden: You don\'t have permission to add departments');
      } else {
        alert('Failed to add Department: ' + (error.response?.data?.message || error.message || 'Server Error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (departmentId) => {
  if (!window.confirm('Are you sure you want to delete this department? This will also delete all associated subjects and materials.')) {
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    console.log('Deleting department with ID:', departmentId);
    console.log('Request URL:', `http://localhost:5000/api/departments/${departmentId}`);
    
    const response = await axios.delete(`http://localhost:5000/api/departments/${departmentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Delete response:', response.data);

    // Remove from local state using the same ID that was passed in
    setDepartments(prev => prev.filter(d => d._id !== departmentId));
    
    alert('Department deleted successfully.');
    
  } catch (error) {
    console.error('Error deleting department:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Full error object:', error);
    
    if (error.response?.status === 404) {
      alert('Department not found. It may have already been deleted.');
      // Remove from local state anyway since it doesn't exist on server
      setDepartments(prev => prev.filter(d => d._id !== departmentId));
    } else if (error.response?.status === 401) {
      alert('Unauthorized: Please log in again');
    } else if (error.response?.status === 403) {
      alert('Forbidden: You don\'t have permission to delete departments');
    } else {
      alert('Failed to delete department: ' + (error.response?.data?.message || error.message || 'Server Error'));
    }
  } finally {
    setLoading(false);
  }
};

  // Subjects (courses) state
  const [subjects, setSubjects] = useState([
    { 
      _id: '1', 
      subjectCode: 'CS101', 
      name: 'Data Structures', 
      department: '1', 
      departmentId: 'CSE',
      year: 1,
      semester: 1,
      credits: 3,
      description: 'Basic data structures concepts',
      learningOutcomes: [],
      syllabus: ''
    },
    { 
      _id: '2', 
      subjectCode: 'CS201', 
      name: 'Algorithms', 
      department: '1', 
      departmentId: 'CSE',
      year: 2,
      semester: 1,
      credits: 4,
      description: 'Algorithm design and analysis',
      learningOutcomes: [],
      syllabus: ''
    },
  ]);

  // Materials state
  const [materials, setMaterials] = useState([
    {
      _id: '1',
      subjectId: '1',
      name: 'Lecture 1 Slides',
      type: 'pdf',
      url: '#',
      size: '2.4 MB',
      uploadDate: '2023-05-15'
    }
  ]);

  // Filter states for subjects
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');

  // Form states
  const [newSubject, setNewSubject] = useState({
    subjectCode: '',
    name: '',
    department: '',
    departmentId: '',
    year: 1,
    semester: 1,
    credits: 3,
    description: '',
    learningOutcomes: [],
    syllabus: ''
  });

  const [newMaterial, setNewMaterial] = useState({
    name: '',
    file: null,
    fileType: ''
  });

  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedSubjectForMaterial, setSelectedSubjectForMaterial] = useState('');

  // Subject functions
  const addSubject = () => {
    if (!newSubject.subjectCode.trim() || !newSubject.name.trim() || !newSubject.department) {
      alert('Please fill in all required fields');
      return;
    }

    const newSubjectWithId = { 
      ...newSubject, 
      _id: String(subjects.length + 1),
      subjectCode: newSubject.subjectCode.trim().toUpperCase(),
      name: newSubject.name.trim(),
      description: newSubject.description.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setSubjects(prev => [...prev, newSubjectWithId]);
    setNewSubject({
      subjectCode: '',
      name: '',
      department: '',
      departmentId: '',
      year: 1,
      semester: 1,
      credits: 3,
      description: '',
      learningOutcomes: [],
      syllabus: ''
    });
    
    alert('Subject added successfully.');
  };

  const deleteSubject = (id) => {
    if (!window.confirm('Are you sure you want to delete this subject? This will also delete all associated materials.')) {
      return;
    }
    
    setSubjects(prev => prev.filter(s => s._id !== id));
    setMaterials(prev => prev.filter(m => m.subjectId !== id));
    alert('Subject deleted successfully.');
  };

  // Material functions
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      const fileType = file.type.split('/')[0];
      setNewMaterial({
        ...newMaterial,
        file,
        fileType,
        name: newMaterial.name || file.name.split('.')[0]
      });
    }
  };

  const addMaterial = () => {
    if (!selectedSubjectForMaterial || !newMaterial.file) {
      alert('Please select a subject and upload a file');
      return;
    }
    
    const newMaterialEntry = {
      _id: String(materials.length + 1),
      subjectId: selectedSubjectForMaterial,
      name: newMaterial.name || newMaterial.file.name,
      type: newMaterial.fileType,
      url: '#',
      size: `${(newMaterial.file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    setMaterials(prev => [...prev, newMaterialEntry]);
    setNewMaterial({ name: '', file: null, fileType: '' });
    setShowMaterialModal(false);
    alert('Material uploaded successfully.');
  };

  const deleteMaterial = (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }
    
    setMaterials(prev => prev.filter(m => m._id !== id));
    alert('Material deleted successfully.');
  };

  // Filter functions
  const filteredSubjects = subjects.filter(s => {
    const deptMatch = selectedDept === 'all' || s.department === selectedDept;
    const yearMatch = selectedYear === 'all' || s.year === parseInt(selectedYear);
    const semesterMatch = selectedSemester === 'all' || s.semester === parseInt(selectedSemester);
    return deptMatch && yearMatch && semesterMatch;
  });

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return '📄';
      case 'video': return '🎬';
      case 'image': return '🖼️';
      default: return '📁';
    }
  };

  // Tab navigation
  const renderTabContent = () => {
    switch(activeTab) {
      case 'departments':
        return (
          <div className="tab-content">
            <h2 className="section-title">Manage Departments</h2>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Department ID (e.g., HNDIT)"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Department Name"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  required
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Description (Optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button 
                className="btn-primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Department'}
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
                      <td colSpan="4" className="loading-cell">Loading...</td>
                    </tr>
                  ) : departments.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-cell">No departments found</td>
                    </tr>
                  ) : (
                    departments.map((d) => (
                      <tr key={d._id || d.id}>
                        <td>{d.departmentId}</td>
                        <td>{d.departmentName || d.name}</td>
                        <td>{d.description || '-'}</td>
                        <td>
                          <button 
                            onClick={() => deleteDepartment(d._id)} 
                            className="btn-delete"
                            disabled={loading}
                          >
                            Delete
                          </button>
                          <button 
                            className="btn-edit"
                            disabled={loading}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'subjects':
        return (
          <div className="tab-content">
            <h2 className="section-title">Manage Subjects</h2>

            <div className="form-grid">
              <input
                type="text"
                placeholder="Subject Code"
                value={newSubject.subjectCode}
                onChange={(e) => setNewSubject({...newSubject, subjectCode: e.target.value.toUpperCase()})}
                required
              />
              <input
                type="text"
                placeholder="Subject Name"
                value={newSubject.name}
                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                required
              />
              <select
                value={newSubject.department}
                onChange={(e) => {
                  const selected = departments.find(d => (d._id || d.id) === e.target.value);
                  setNewSubject({
                    ...newSubject,
                    department: e.target.value,
                    departmentId: selected?.departmentId || ''
                  });
                }}
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id || d.id} value={d._id || d.id}>
                    {(d.departmentName || d.name)} ({d.departmentId})
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Credits"
                min="1"
                max="10"
                value={newSubject.credits}
                onChange={(e) => setNewSubject({...newSubject, credits: parseInt(e.target.value) || 1})}
                required
              />
            </div>

            <div className="form-grid">
              <select
                value={newSubject.year}
                onChange={(e) => setNewSubject({...newSubject, year: parseInt(e.target.value)})}
              >
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
              <select
                value={newSubject.semester}
                onChange={(e) => setNewSubject({...newSubject, semester: parseInt(e.target.value)})}
              >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
              <input
                type="text"
                placeholder="Description (Optional)"
                className="col-span-2"
                value={newSubject.description}
                onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
              />
            </div>
            <button 
              onClick={addSubject} 
              className="btn-primary"
              disabled={!newSubject.subjectCode || !newSubject.name || !newSubject.department}
            >
              Add Subject
            </button>

            {/* Filters */}
            <div className="filter-container">
              <div className="filter-group">
                <label>Department:</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {departments.map((d) => (
                    <option key={d._id || d.id} value={d._id || d.id}>
                      {d.departmentName || d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
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
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
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
                  {filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-cell">No subjects found</td>
                    </tr>
                  ) : (
                    filteredSubjects.map((s) => {
                      const dept = departments.find(d => (d._id || d.id) === s.department);
                      return (
                        <tr key={s._id}>
                          <td>{s.subjectCode}</td>
                          <td>{s.name}</td>
                          <td>{dept ? `${dept.departmentName || dept.name} (${dept.departmentId})` : 'N/A'}</td>
                          <td>Year {s.year} - Sem {s.semester}</td>
                          <td>{s.credits}</td>
                          <td>
                            <button 
                              onClick={() => deleteSubject(s._id)} 
                              className="btn-delete"
                            >
                              Delete
                            </button>
                            <button 
                              className="btn-edit"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'materials':
        return (
          <div className="tab-content">
            <h2 className="section-title">Course Materials</h2>
            
            <div className="materials-controls">
              <select
                value={selectedSubjectForMaterial}
                onChange={(e) => setSelectedSubjectForMaterial(e.target.value)}
                className="subject-selector"
              >
                <option value="">Select Subject to Add Materials</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subjectCode} - {s.name}
                  </option>
                ))}
              </select>
              
              <button 
                onClick={() => setShowMaterialModal(true)} 
                className="btn-primary"
                disabled={!selectedSubjectForMaterial}
              >
                + Add Material
              </button>
            </div>

            {/* Materials Table */}
            <div className="materials-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Material</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Upload Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-cell">No materials found</td>
                    </tr>
                  ) : (
                    materials.map((m) => {
                      const subject = subjects.find(s => s._id === m.subjectId);
                      return (
                        <tr key={m._id}>
                          <td>{subject ? `${subject.subjectCode} - ${subject.name}` : 'Unknown Subject'}</td>
                          <td className="material-name-cell">
                            <span className="file-icon">{getFileIcon(m.type)}</span>
                            <a href={m.url} className="material-link" target="_blank" rel="noopener noreferrer">
                              {m.name}
                            </a>
                          </td>
                          <td>{m.type.toUpperCase()}</td>
                          <td>{m.size}</td>
                          <td>{m.uploadDate}</td>
                          <td className="action-buttons">
                            <button 
                              className="btn-edit"
                            >
                              Edit
                            </button>
                            <button className="btn-download">Download</button>
                            <button 
                              onClick={() => deleteMaterial(m._id)} 
                              className="btn-delete"
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
                    <h3>
                      Upload Material for: {
                        subjects.find(s => s._id === selectedSubjectForMaterial)?.name || 'Selected Subject'
                      }
                    </h3>
                    <button 
                      onClick={() => {
                        setShowMaterialModal(false);
                        setNewMaterial({ name: '', file: null, fileType: '' });
                      }} 
                      className="modal-close-btn"
                    >
                      &times;
                    </button>
                  </div>
                  
                  <div className="modal-form">
                    <div className="form-group">
                      <label>Material Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Lecture 1 Slides"
                        value={newMaterial.name}
                        onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="file-upload-label">
                        <input 
                          type="file" 
                          onChange={handleFileChange}
                          className="file-upload-input"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.mov"
                        />
                        <div className="file-upload-box">
                          {newMaterial.file ? (
                            <>
                              <span className="file-icon-large">{getFileIcon(newMaterial.fileType)}</span>
                              <div className="file-info">
                                <div className="file-name">{newMaterial.file.name}</div>
                                <div className="file-size">
                                  {(newMaterial.file.size / (1024 * 1024)).toFixed(2)} MB
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="upload-instructions">
                              <span className="upload-icon">📤</span>
                              <p>Click to browse or drag and drop files</p>
                              <p className="file-types">PDF, DOC, PPT, JPG, MP4, etc.</p>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                    
                    <div className="modal-actions">
                      <button 
                        onClick={() => {
                          setShowMaterialModal(false);
                          setNewMaterial({ name: '', file: null, fileType: '' });
                        }} 
                        className="btn-cancel"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={addMaterial} 
                        className="btn-primary"
                        disabled={!newMaterial.file}
                      >
                        Upload Material
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="admin-courses-container">
      <Navbar />
      <Navtabs />

      <div className="admin-content">
        {/* Tab Navigation */}
        <div className="courses-tab-nav">
          <button
            className={`tab-button ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            Departments
          </button>
          <button
            className={`tab-button ${activeTab === 'subjects' ? 'active' : ''}`}
            onClick={() => setActiveTab('subjects')}
          >
            Subjects
          </button>
          <button
            className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            Materials
          </button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      <Footer />
    </div>
  );
}