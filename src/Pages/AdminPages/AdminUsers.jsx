import React, { useState } from 'react';
import Navbar from '../../Components/WebPage/Navbar/Navbar';
import Navtabs from '../../Components/Admin/Navtabs/Navtabs';
import Footer from '../../Components/WebPage/Footer/Footer';
import './styles/AdminUsers.css';
import axios from 'axios';

export default function AdminUsers() {
  const academicDepartments = ['HNDIT', 'HNDE', 'HNDM', 'HNDTHM', 'HNDAC'];
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeRole, setActiveRole] = useState('all');
  const [activeDepartment, setActiveDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      userId,
      firstName,
      lastName,
      email,
      password,
      role,
    };

    if (role !== 'admin') {
      newUser.department = department;
    }

    axios.post('http://localhost:5000/api/users', newUser)
      .then(result => {
        console.log('User added successfully:', result.data);
        setShowAddModal(false);

        alert('User added successfully.');

        // Reset form
        setUserId('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setRole('student');
        setDepartment('');
      })
      .catch(error => {
        console.error('Error adding user:', error);
        alert('Failed to add user: ' + (error.response?.data?.message || 'Server Error'));
      });
  };

  return (
    <div className="admin-users-page">
      <Navbar />
      <Navtabs />

      <div className="page-container">
        <div className="header">
          <h2>User Management</h2>
          <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
            Add New User
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by User ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">
              <i className="fas fa-search"></i>
            </span>
          </div>
        </div>

        {/* Role filter */}
        <div className="filter-section">
          <h5>Filter by Role:</h5>
          <div className="button-group">
            {['all', 'admin', 'lecturer', 'student'].map(role => (
              <button
                key={role}
                className={`role-btn ${activeRole === role ? 'active' : ''}`}
                onClick={() => setActiveRole(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}s
              </button>
            ))}
          </div>
        </div>

        {/* Department filter */}
        {(activeRole === 'student' || activeRole === 'lecturer' || activeRole === 'all') && (
          <div className="filter-section">
            <h5>Filter by Department:</h5>
            <select
              className="dept-select"
              value={activeDepartment}
              onChange={(e) => setActiveDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {academicDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        )}

        {/* Users table */}
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="no-users">
                  No users to display
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add New User</h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="userId">User ID</label>
                  <input
                    type="text"
                    value={userId}
                    placeholder="Enter user ID"
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    placeholder="Enter first name"
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    placeholder="Enter last name"
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    value={email}
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    value={password}
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Department only for non-admins */}
                {role !== 'admin' && (
                  <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    >
                      <option value="">-- Select Department --</option>
                      {academicDepartments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    className="cancel-btn"
                    type="button"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="submit-btn" type="submit">
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
