// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import './styles/AdminDashboard.css';
import Navbar from '../../Components/WebPage/Navbar/Navbar';
import Navtabs from '../../Components/Admin/Navtabs/Navtabs';
import Footer from '../../Components/WebPage/Footer/Footer';


const AdminDashboard = () => {
  // State for statistics cards
  const [stats, setStats] = useState({
    totalAdmins: 5,
    totalStudents: 342,
    totalLecturers: 28,
    totalDepartments: 8
  });

  // State for user management
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', department: 'IT' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'lecturer', department: 'Computer Science' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'student', department: 'Engineering' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'student', department: 'Business' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'lecturer', department: 'Computer Science' },
  ]);

  // State for news management
  const [news, setNews] = useState([
    { id: 1, title: 'New Course Available', content: 'Introduction to AI now available', date: '2023-05-15', image: 'ai-course.jpg' },
    { id: 2, title: 'System Maintenance', content: 'Scheduled maintenance on June 1st', date: '2023-05-10', image: 'maintenance.jpg' },
  ]);

  // State for course management
  const [courses, setCourses] = useState([
    { id: 1, title: 'Introduction to Programming', code: 'CS101', department: 'Computer Science', lecturer: 'Dr. Smith', students: 45 },
    { id: 2, title: 'Database Systems', code: 'CS201', department: 'Computer Science', lecturer: 'Prof. Johnson', students: 32 },
    { id: 3, title: 'Electrical Circuits', code: 'EE101', department: 'Engineering', lecturer: 'Dr. Brown', students: 28 },
    { id: 4, title: 'Business Management', code: 'BM101', department: 'Business', lecturer: 'Prof. Wilson', students: 56 },
  ]);

  // State for modals and filters
  const [activeTab, setActiveTab] = useState('users');
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userDeptFilter, setUserDeptFilter] = useState('all');
  const [courseDeptFilter, setCourseDeptFilter] = useState('all');
  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
    image: null
  });
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showCourseDeptDropdown, setShowCourseDeptDropdown] = useState(false);

  // Get unique departments from users and courses
  const userDepartments = [...new Set(users.map(user => user.department))];
  const courseDepartments = [...new Set(courses.map(course => course.department))];

  // Filter users by role and department
  const filteredUsers = users.filter(user => {
    const roleMatch = userRoleFilter === 'all' || user.role === userRoleFilter;
    const deptMatch = userDeptFilter === 'all' || user.department === userDeptFilter;
    return roleMatch && deptMatch;
  });

  // Filter courses by department
  const filteredCourses = courseDeptFilter === 'all' 
    ? courses 
    : courses.filter(course => course.department === courseDeptFilter);

  // Handle news image upload
  const handleImageUpload = (e) => {
    setNewNews({
      ...newNews,
      image: URL.createObjectURL(e.target.files[0])
    });
  };

  // Add new news
  const addNews = () => {
    const newItem = {
      id: news.length + 1,
      title: newNews.title,
      content: newNews.content,
      date: new Date().toISOString().split('T')[0],
      image: newNews.image || 'default-news.jpg'
    };
    setNews([...news, newItem]);
    setShowNewsModal(false);
    setNewNews({ title: '', content: '', image: null });
  };

  // Edit news
  const editNews = () => {
    const updatedNews = news.map(item => 
      item.id === selectedNews.id 
        ? { ...item, title: newNews.title, content: newNews.content, image: newNews.image || item.image }
        : item
    );
    setNews(updatedNews);
    setShowNewsModal(false);
    setSelectedNews(null);
    setNewNews({ title: '', content: '', image: null });
  };

  // Delete news
  const deleteNews = (id) => {
    setNews(news.filter(item => item.id !== id));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowRoleDropdown(false);
      setShowDeptDropdown(false);
      setShowCourseDeptDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="admin-dashboard">
        <Navbar/>
        <Navtabs/>
        

      <div className="container-fluid">
        <div className="row">
          {/* Statistics Cards */}
          <div className="stats-container">
            <div className="stat-card" style={{ backgroundColor: '#2ecc71' }}>
              <h3>Total Admins</h3>
              <p>{stats.totalAdmins}</p>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#3498db' }}>
              <h3>Total Students</h3>
              <p>{stats.totalStudents}</p>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#f39c12' }}>
              <h3>Total Lecturers</h3>
              <p>{stats.totalLecturers}</p>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#e74c3c' }}>
              <h3>Total Departments</h3>
              <p>{stats.totalDepartments}</p>
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
                    className={`tab-link ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('users');
                    }}
                  >
                    User Management
                  </a>
                  <a 
                    href="#news" 
                    className={`tab-link ${activeTab === 'news' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('news');
                    }}
                  >
                    News Management
                  </a>
                  <a 
                    href="#courses" 
                    className={`tab-link ${activeTab === 'courses' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('courses');
                    }}
                  >
                    Course Management
                  </a>
                  <a 
                    href="#reports" 
                    className={`tab-link ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('reports');
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
            {activeTab === 'users' && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h5>User Management</h5>
                  <div className="filter-container">
                    {/* Role Filter Dropdown */}
                    <div className="filter-dropdown">
                      <button 
                        className={`dropdown-toggle ${userRoleFilter === 'all' ? '' : 'outline'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRoleDropdown(!showRoleDropdown);
                        }}
                      >
                        {userRoleFilter === 'all' ? 'All Roles' : userRoleFilter}
                        <span>▼</span>
                      </button>
                      <div className={`dropdown-menu ${showRoleDropdown ? 'show' : ''}`}>
                        <div 
                          className={`dropdown-item ${userRoleFilter === 'all' ? 'active' : ''}`}
                          onClick={() => {
                            setUserRoleFilter('all');
                            setShowRoleDropdown(false);
                          }}
                        >
                          All Roles
                        </div>
                        <div 
                          className={`dropdown-item ${userRoleFilter === 'admin' ? 'active' : ''}`}
                          onClick={() => {
                            setUserRoleFilter('admin');
                            setShowRoleDropdown(false);
                          }}
                        >
                          Admins
                        </div>
                        <div 
                          className={`dropdown-item ${userRoleFilter === 'lecturer' ? 'active' : ''}`}
                          onClick={() => {
                            setUserRoleFilter('lecturer');
                            setShowRoleDropdown(false);
                          }}
                        >
                          Lecturers
                        </div>
                        <div 
                          className={`dropdown-item ${userRoleFilter === 'student' ? 'active' : ''}`}
                          onClick={() => {
                            setUserRoleFilter('student');
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
                        className={`dropdown-toggle ${userDeptFilter === 'all' ? '' : 'outline'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeptDropdown(!showDeptDropdown);
                        }}
                      >
                        {userDeptFilter === 'all' ? 'All Departments' : userDeptFilter}
                        <span>▼</span>
                      </button>
                      <div className={`dropdown-menu ${showDeptDropdown ? 'show' : ''}`}>
                        <div 
                          className={`dropdown-item ${userDeptFilter === 'all' ? 'active' : ''}`}
                          onClick={() => {
                            setUserDeptFilter('all');
                            setShowDeptDropdown(false);
                          }}
                        >
                          All Departments
                        </div>
                        {userDepartments.map(dept => (
                          <div 
                            key={dept}
                            className={`dropdown-item ${userDeptFilter === dept ? 'active' : ''}`}
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
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge badge-${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{user.department}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* News Management Tab */}
            {activeTab === 'news' && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h5>News Management</h5>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedNews(null);
                      setNewNews({ title: '', content: '', image: null });
                      setShowNewsModal(true);
                    }}
                  >
                    Add News
                  </button>
                </div>
                <div className="card-body">
                  <div className="row" style={{ display: 'flex', flexWrap: 'wrap', margin: '-10px' }}>
                    {news.map(item => (
                      <div key={item.id} style={{ width: '33.33%', padding: '10px' }}>
                        <div className="dashboard-card">
                          <img src={item.image} alt={item.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                          <div className="card-body">
                            <h5 style={{ margin: '0 0 10px 0' }}>{item.title}</h5>
                            <p style={{ margin: '0 0 10px 0' }}>{item.content}</p>
                            <small style={{ color: '#777' }}>Posted: {item.date}</small>
                          </div>
                          <div className="card-footer" style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                setSelectedNews(item);
                                setNewNews({
                                  title: item.title,
                                  content: item.content,
                                  image: item.image
                                });
                                setShowNewsModal(true);
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => deleteNews(item.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Course Management Tab */}
            {activeTab === 'courses' && (
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
                      {courseDeptFilter === 'all' ? 'All Departments' : courseDeptFilter}
                      <span>▼</span>
                    </button>
                    <div className={`dropdown-menu ${showCourseDeptDropdown ? 'show' : ''}`}>
                      <div 
                        className={`dropdown-item ${courseDeptFilter === 'all' ? 'active' : ''}`}
                        onClick={() => {
                          setCourseDeptFilter('all');
                          setShowCourseDeptDropdown(false);
                        }}
                      >
                        All Departments
                      </div>
                      {courseDepartments.map(dept => (
                        <div 
                          key={dept}
                          className={`dropdown-item ${courseDeptFilter === dept ? 'active' : ''}`}
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
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Course Code</th>
                        <th>Title</th>
                        <th>Department</th>
                        <th>Lecturer</th>
                        <th>Students</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map(course => (
                        <tr key={course.id}>
                          <td>{course.code}</td>
                          <td>{course.title}</td>
                          <td>{course.department}</td>
                          <td>{course.lecturer}</td>
                          <td>{course.students}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
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

      {/* Add/Edit News Modal */}
      {showNewsModal && (
        <div className="modal show">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedNews ? 'Edit News' : 'Add News'}</h3>
              <button 
                style={{ background: 'none', border: 'none', fontSize: '1.5rem' }}
                onClick={() => setShowNewsModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={newNews.title}
                  onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newNews.content}
                  onChange={(e) => setNewNews({...newNews, content: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {newNews.image && (
                  <img 
                    src={newNews.image} 
                    alt="Preview" 
                    className="img-thumbnail"
                  />
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowNewsModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={selectedNews ? editNews : addNews}
                disabled={!newNews.title || !newNews.content}
              >
                {selectedNews ? 'Save Changes' : 'Add News'}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default AdminDashboard;