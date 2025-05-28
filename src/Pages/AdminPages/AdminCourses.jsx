import React, { useState } from 'react';
import Navbar from '../../Components/WebPage/Navbar/Navbar';
import Navtabs from '../../Components/Admin/Navtabs/Navtabs';
import Footer from '../../Components/WebPage/Footer/Footer';
import './styles/AdminCourses.css';

export default function AdminCourses() {
  // Departments state
  const [departments, setDepartments] = useState([
    { 
      _id: '1', 
      departmentId: 'CSE', 
      name: 'Computer Science', 
      description: 'Computer Science Department',
      imageUrl: ''
    },
    { 
      _id: '2', 
      departmentId: 'EEE', 
      name: 'Electrical Engineering', 
      description: 'Electrical Engineering Department',
      imageUrl: ''
    },
  ]);

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

  // Filter states
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');

  // Form states
  const [newDept, setNewDept] = useState({
    departmentId: '',
    name: '',
    description: '',
    imageUrl: ''
  });

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

  // Department functions
  const addDepartment = () => {
    const newDeptWithId = { 
      ...newDept, 
      _id: String(departments.length + 1),
      createdAt: new Date().toISOString()
    };
    setDepartments([...departments, newDeptWithId]);
    setNewDept({
      departmentId: '',
      name: '',
      description: '',
      imageUrl: ''
    });
  };

  const deleteDepartment = (id) => {
    setDepartments(departments.filter(d => d._id !== id));
    setSubjects(subjects.filter(s => s.department !== id));
    setMaterials(materials.filter(m => 
      !subjects.some(s => s._id === m.subjectId && s.department === id)
    ));
  };

  // Subject functions
  const addSubject = () => {
    const newSubjectWithId = { 
      ...newSubject, 
      _id: String(subjects.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSubjects([...subjects, newSubjectWithId]);
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
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s._id !== id));
    setMaterials(materials.filter(m => m.subjectId !== id));
  };

  // Material functions
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[0];
      setNewMaterial({
        ...newMaterial,
        file,
        fileType,
        name: file.name.split('.')[0]
      });
    }
  };

  const addMaterial = () => {
    if (!selectedSubjectForMaterial || !newMaterial.file) return;
    
    const newMaterialEntry = {
      _id: String(materials.length + 1),
      subjectId: selectedSubjectForMaterial,
      name: newMaterial.name || newMaterial.file.name,
      type: newMaterial.fileType,
      url: '#',
      size: `${(newMaterial.file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    setMaterials([...materials, newMaterialEntry]);
    setNewMaterial({ name: '', file: null, fileType: '' });
    setShowMaterialModal(false);
  };

  const deleteMaterial = (id) => {
    setMaterials(materials.filter(m => m._id !== id));
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

  return (
    <div className="admin-courses-container">
      <Navbar />
      <Navtabs />

      <div className="admin-content">
        {/* Departments Section */}
        <h2 className="section-title">Manage Departments</h2>

        <div className="form-grid">
          <input
            type="text"
            placeholder="Department ID (e.g., CSE)"
            value={newDept.departmentId}
            onChange={(e) => setNewDept({...newDept, departmentId: e.target.value.toUpperCase()})}
          />
          <input
            type="text"
            placeholder="Department Name"
            value={newDept.name}
            onChange={(e) => setNewDept({...newDept, name: e.target.value})}
          />
          <input
            type="text"
            placeholder="Description (Optional)"
            value={newDept.description}
            onChange={(e) => setNewDept({...newDept, description: e.target.value})}
          />
        </div>
        <button 
          onClick={addDepartment} 
          className="btn-primary"
          disabled={!newDept.departmentId || !newDept.name}
        >
          Add Department
        </button>

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
              {departments.map((d) => (
                <tr key={d._id}>
                  <td>{d.departmentId}</td>
                  <td>{d.name}</td>
                  <td>{d.description || '-'}</td>
                  <td>
                    <button 
                      onClick={() => deleteDepartment(d._id)} 
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subjects Section */}
        <h2 className="section-title">Manage Subjects</h2>

        <div className="form-grid">
          <input
            type="text"
            placeholder="Subject Code"
            value={newSubject.subjectCode}
            onChange={(e) => setNewSubject({...newSubject, subjectCode: e.target.value.toUpperCase()})}
          />
          <input
            type="text"
            placeholder="Subject Name"
            value={newSubject.name}
            onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
          />
          <select
            value={newSubject.department}
            onChange={(e) => {
              const selected = departments.find(d => d._id === e.target.value);
              setNewSubject({
                ...newSubject,
                department: e.target.value,
                departmentId: selected?.departmentId || ''
              });
            }}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.departmentId})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Credits"
            min="1"
            max="10"
            value={newSubject.credits}
            onChange={(e) => setNewSubject({...newSubject, credits: parseInt(e.target.value)})}
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
                <option key={d._id} value={d._id}>{d.name}</option>
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
              {filteredSubjects.map((s) => {
                const dept = departments.find(d => d._id === s.department);
                return (
                  <tr key={s._id}>
                    <td>{s.subjectCode}</td>
                    <td>{s.name}</td>
                    <td>{dept ? `${dept.name} (${dept.departmentId})` : 'N/A'}</td>
                    <td>Year {s.year} - Sem {s.semester}</td>
                    <td>{s.credits}</td>
                    <td>
                      <button 
                        onClick={() => deleteSubject(s._id)} 
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Materials Section */}
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
              {materials.map((m) => {
                const subject = subjects.find(s => s._id === m.subjectId);
                return (
                  <tr key={m._id}>
                    <td>{subject ? `${subject.subjectCode} - ${subject.name}` : 'Unknown Subject'}</td>
                    <td className="material-name-cell">
                      <span className="file-icon">{getFileIcon(m.type)}</span>
                      <a href={m.url} className="material-link">
                        {m.name}
                      </a>
                    </td>
                    <td>{m.type.toUpperCase()}</td>
                    <td>{m.size}</td>
                    <td>{m.uploadDate}</td>
                    <td>
                      <div className="material-actions">
                        <button className="btn-download">Download</button>
                        <button 
                          onClick={() => deleteMaterial(m._id)} 
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

      <Footer />
    </div>
  );
}