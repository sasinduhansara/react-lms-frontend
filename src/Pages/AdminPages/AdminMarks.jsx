import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/WebPage/Navbar/Navbar';
import Navtabs from '../../Components/Admin/Navtabs/Navtabs';
import Footer from '../../Components/WebPage/Footer/Footer';
import './styles/AdminMarks.css';

const MarksManagement = () => {
  // State for form inputs
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [assignmentMarks, setAssignmentMarks] = useState('');
  const [examMarks, setExamMarks] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentMarkId, setCurrentMarkId] = useState(null);

  // State for departments and subjects
  const [departments, setDepartments] = useState([
    'Computer Science',
    'Mathematics',
    'Physics',
    'Engineering',
    'Business'
  ]);

  const [subjects, setSubjects] = useState({
    'Computer Science': ['Programming', 'Data Structures', 'Algorithms', 'Database'],
    'Mathematics': ['Calculus', 'Algebra', 'Statistics', 'Discrete Math'],
    'Physics': ['Mechanics', 'Electromagnetism', 'Thermodynamics', 'Quantum Physics'],
    'Engineering': ['Circuit Theory', 'Mechanics', 'Materials Science', 'Thermodynamics'],
    'Business': ['Accounting', 'Economics', 'Marketing', 'Management']
  });

  // State for marks data
  const [marks, setMarks] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [filterStudentId, setFilterStudentId] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [studentList, setStudentList] = useState([]);

  // Load sample data or from localStorage
  useEffect(() => {
    const savedMarks = localStorage.getItem('marksData');
    if (savedMarks) {
      const parsedMarks = JSON.parse(savedMarks);
      setMarks(parsedMarks);
      // Extract unique student IDs
      const uniqueStudentIds = [...new Set(parsedMarks.map(mark => mark.studentId))];
      setStudentList(uniqueStudentIds);
    } else {
      // Sample data
      const sampleMarks = [
        { id: 1, studentId: 'S001', department: 'Computer Science', subject: 'Programming', assignmentMarks: 85, examMarks: 75 },
        { id: 2, studentId: 'S001', department: 'Computer Science', subject: 'Data Structures', assignmentMarks: 78, examMarks: 82 },
        { id: 3, studentId: 'S001', department: 'Mathematics', subject: 'Calculus', assignmentMarks: 90, examMarks: 88 },
        { id: 4, studentId: 'S002', department: 'Physics', subject: 'Mechanics', assignmentMarks: 92, examMarks: 85 },
        { id: 5, studentId: 'S002', department: 'Physics', subject: 'Electromagnetism', assignmentMarks: 88, examMarks: 90 },
        { id: 6, studentId: 'S003', department: 'Business', subject: 'Accounting', assignmentMarks: 75, examMarks: 80 }
      ];
      setMarks(sampleMarks);
      const uniqueStudentIds = [...new Set(sampleMarks.map(mark => mark.studentId))];
      setStudentList(uniqueStudentIds);
      localStorage.setItem('marksData', JSON.stringify(sampleMarks));
    }
  }, []);

  // Filter marks based on student, department and subject
  useEffect(() => {
    let result = marks;
    
    if (filterStudentId) {
      result = result.filter(mark => mark.studentId === filterStudentId);
    }
    
    if (filterDepartment) {
      result = result.filter(mark => mark.department === filterDepartment);
    }
    
    if (filterSubject) {
      result = result.filter(mark => mark.subject === filterSubject);
    }
    
    setFilteredMarks(result);
  }, [filterStudentId, filterDepartment, filterSubject, marks]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!studentId || !department || !subject || !assignmentMarks || !examMarks) {
      alert('Please fill all fields');
      return;
    }

    if (editMode) {
      // Update existing mark
      const updatedMarks = marks.map(mark => 
        mark.id === currentMarkId ? {
          ...mark,
          studentId,
          department,
          subject,
          assignmentMarks: parseInt(assignmentMarks),
          examMarks: parseInt(examMarks)
        } : mark
      );
      setMarks(updatedMarks);
      localStorage.setItem('marksData', JSON.stringify(updatedMarks));
      setEditMode(false);
      setCurrentMarkId(null);
    } else {
      // Add new mark
      const newMark = {
        id: Date.now(),
        studentId,
        department,
        subject,
        assignmentMarks: parseInt(assignmentMarks),
        examMarks: parseInt(examMarks)
      };
      const updatedMarks = [...marks, newMark];
      setMarks(updatedMarks);
      
      // Update student list if new student
      if (!studentList.includes(studentId)) {
        setStudentList([...studentList, studentId]);
      }
      
      localStorage.setItem('marksData', JSON.stringify(updatedMarks));
    }

    // Reset form
    setStudentId('');
    setDepartment('');
    setSubject('');
    setAssignmentMarks('');
    setExamMarks('');
  };

  // Handle edit
  const handleEdit = (mark) => {
    setStudentId(mark.studentId);
    setDepartment(mark.department);
    setSubject(mark.subject);
    setAssignmentMarks(mark.assignmentMarks);
    setExamMarks(mark.examMarks);
    setEditMode(true);
    setCurrentMarkId(mark.id);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this mark record?')) {
      const updatedMarks = marks.filter(mark => mark.id !== id);
      setMarks(updatedMarks);
      localStorage.setItem('marksData', JSON.stringify(updatedMarks));
      
      // Check if student still has marks
      const studentIdToCheck = marks.find(mark => mark.id === id)?.studentId;
      if (studentIdToCheck && !updatedMarks.some(mark => mark.studentId === studentIdToCheck)) {
        setStudentList(studentList.filter(id => id !== studentIdToCheck));
      }
    }
  };

  // Calculate total marks
  const calculateTotal = (assignment, exam) => {
    return assignment + exam;
  };

  // Calculate average for a student
  const calculateStudentAverage = (studentId) => {
    const studentMarks = marks.filter(mark => mark.studentId === studentId);
    if (studentMarks.length === 0) return 0;
    
    const total = studentMarks.reduce((sum, mark) => sum + mark.assignmentMarks + mark.examMarks, 0);
    return (total / (studentMarks.length * 2)).toFixed(2);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterStudentId('');
    setFilterDepartment('');
    setFilterSubject('');
  };

  return (
    <div>
        <Navbar/>
            <Navtabs/>
    <div className="marks-container">
      <h1>Marks Management System</h1>
      
      <div className="marks-form">
        <h2>{editMode ? 'Edit Marks' : 'Add New Marks'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student ID:</label>
            <input 
              type="text" 
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter student ID"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Department:</label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setSubject('');
              }}
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Subject:</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={!department}
              required
            >
              <option value="">Select Subject</option>
              {department && subjects[department].map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Assignment Marks:</label>
            <input 
              type="number" 
              value={assignmentMarks}
              onChange={(e) => setAssignmentMarks(e.target.value)}
              min="0"
              max="100"
              placeholder="0-100"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Exam Marks:</label>
            <input 
              type="number" 
              value={examMarks}
              onChange={(e) => setExamMarks(e.target.value)}
              min="0"
              max="100"
              placeholder="0-100"
              required
            />
          </div>
          
          <button type="submit" className="submit-btn">
            {editMode ? 'Update Marks' : 'Add Marks'}
          </button>
          
          {editMode && (
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => {
                setEditMode(false);
                setStudentId('');
                setDepartment('');
                setSubject('');
                setAssignmentMarks('');
                setExamMarks('');
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      
      <div className="marks-filter">
        <h2>Filter Marks</h2>
        <div className="filter-controls">
          <div className="form-group">
            <label>Student ID:</label>
            <select
              value={filterStudentId}
              onChange={(e) => {
                setFilterStudentId(e.target.value);
                setFilterDepartment('');
                setFilterSubject('');
              }}
            >
              <option value="">All Students</option>
              {studentList.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Department:</label>
            <select
              value={filterDepartment}
              onChange={(e) => {
                setFilterDepartment(e.target.value);
                setFilterSubject('');
              }}
              disabled={!filterStudentId}
            >
              <option value="">All Departments</option>
              {filterStudentId && [...new Set(marks
                .filter(mark => mark.studentId === filterStudentId)
                .map(mark => mark.department)
              )].map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Subject:</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              disabled={!filterDepartment}
            >
              <option value="">All Subjects</option>
              {filterDepartment && [...new Set(marks
                .filter(mark => mark.studentId === filterStudentId && mark.department === filterDepartment)
                .map(mark => mark.subject)
              )].map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          
          <button 
            type="button" 
            className="reset-btn"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      <div className="marks-list">
        <h2>Marks Records</h2>
        
        {filterStudentId && (
          <div className="student-summary">
            <h3>Summary for Student: {filterStudentId}</h3>
            <p>Total Subjects: {filteredMarks.length}</p>
            <p>Average Marks: {calculateStudentAverage(filterStudentId)}%</p>
          </div>
        )}
        
        {filteredMarks.length === 0 ? (
          <p>No marks records found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Department</th>
                <th>Subject</th>
                <th>Assignment</th>
                <th>Exam</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarks.map(mark => (
                <tr key={mark.id}>
                  <td>{mark.studentId}</td>
                  <td>{mark.department}</td>
                  <td>{mark.subject}</td>
                  <td>{mark.assignmentMarks}</td>
                  <td>{mark.examMarks}</td>
                  <td>{calculateTotal(mark.assignmentMarks, mark.examMarks)}</td>
                  <td>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(mark)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(mark.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>

    <Footer/>
    </div>
  );
};

export default MarksManagement;