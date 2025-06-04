import React, { useState, useEffect } from 'react';
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Users data state
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add user form state
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('');

  // Edit user state
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch all users
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users: ' + (error.response?.data?.message || 'Server Error'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch users by role
  const fetchUsersByRole = async (selectedRole) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/users/role/${selectedRole}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users by role:', error);
      try {
        const allUsersResponse = await axios.get('http://localhost:5000/api/users');
        const filteredByRole = allUsersResponse.data.filter(user => user.role === selectedRole);
        setUsers(filteredByRole);
      } catch (fallbackError) {
        console.error('Error fetching all users as fallback:', fallbackError);
        alert('Failed to fetch users: ' + (fallbackError.response?.data?.message || 'Server Error'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle role filter change
  const handleRoleFilter = (selectedRole) => {
    setActiveRole(selectedRole);
    setActiveDepartment('all');
    setSearchTerm('');

    if (selectedRole === 'all') {
      fetchAllUsers();
    } else {
      fetchUsersByRole(selectedRole);
    }
  };

  // Handle department filter change
  const handleDepartmentFilter = (selectedDept) => {
    setActiveDepartment(selectedDept);
  };

  // Handle search
  const handleSearch = (searchValue) => {
    try {
      setSearchTerm(searchValue || '');
    } catch (error) {
      console.error('Search error:', error);
      setSearchTerm('');
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = users;
    
    if (activeDepartment !== 'all') {
      filtered = filtered.filter(user => user.department === activeDepartment);
    }
    
    if (debouncedSearchTerm.trim() !== '') {
      filtered = filtered.filter(user => 
        user.userId?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, activeDepartment, debouncedSearchTerm]);

  // Load users on component mount
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Add new user
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

    try {
      const result = await axios.post('http://localhost:5000/api/users/register', newUser);
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

      // Refresh users list
      if (activeRole === 'all') {
        fetchAllUsers();
      } else {
        fetchUsersByRole(activeRole);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user: ' + (error.response?.data?.message || 'Server Error'));
    }
  };

  // Delete user
  const handleDeleteUser = async (userIdToDelete, userName) => {
    const confirmMessage = `Are you sure you want to delete user "${userName}" (${userIdToDelete})?\n\nThis action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
        try {
            setLoading(true);
            
            const response = await axios.delete(`http://localhost:5000/api/users/${userIdToDelete}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                alert(`User ${response.data.deletedUser.firstName} ${response.data.deletedUser.lastName} deleted successfully.`);
                
                // Refresh users list
                if (activeRole === 'all') {
                    fetchAllUsers();
                } else {
                    fetchUsersByRole(activeRole);
                }
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            
            let errorMessage = 'Failed to delete user: ';
            if (error.response?.status === 403) {
                errorMessage += 'You do not have permission to delete users.';
            } else if (error.response?.status === 404) {
                errorMessage += 'User not found.';
            } else {
                errorMessage += error.response?.data?.message || 'Server Error';
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    }
  };

  // Update user 
      const handleUpdateUser = async (e) => {
        e.preventDefault();
        
        try {
          const token = localStorage.getItem('token');
          
          const updatedData = {
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName,
            departmentId: selectedUser.departmentId,
            email: selectedUser.email,
            currentEmail: selectedUser.originalEmail || selectedUser.email,
            role: selectedUser.role
          };

          // Password udate 
          if (selectedUser.password) {
            updatedData.password = selectedUser.password;
          }

          const response = await axios.put(
            'http://localhost:5000/api/users/update',
            updatedData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          console.log(response.data);
          alert('User updated successfully!');
          setShowEditModal(false);
          
          // Refresh users list
          if (activeRole === 'all') {
            fetchAllUsers();
          } else {
            fetchUsersByRole(activeRole);
          }
        } catch (error) {
          console.error('Error updating user:', error);
          alert(`Failed to update user: ${error.response?.data?.message || error.message}`);
        }
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
              placeholder="Search by User ID, Name, or Email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
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
            {['all', 'admin', 'lecturer', 'student'].map(roleOption => (
              <button
                key={roleOption}
                className={`role-btn ${activeRole === roleOption ? 'active' : ''}`}
                onClick={() => handleRoleFilter(roleOption)}
              >
                {roleOption === 'all' ? 'All Users' : 
                 roleOption.charAt(0).toUpperCase() + roleOption.slice(1) + 's'}
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
              onChange={(e) => handleDepartmentFilter(e.target.value)}
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
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id || user.userId}>
                      <td>{user.userId}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                        </span>
                      </td>
                      <td>{user.department || 'N/A'}</td>
                      <td>
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => {
                            setSelectedUser({
                              ...user,
                              originalEmail: user.email // original email save කරගන්න
                            });
                            setShowEditModal(true);
                          }}
                          title="Edit User"
                        >
                          <i className="fas fa-edit"></i>
                        </button>

                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteUser(user.userId, `${user.firstName} ${user.lastName}`)}
                          title="Delete User"
                          disabled={loading}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-users">
                      {loading ? 'Loading...' : 
                       searchTerm ? `No users found matching "${searchTerm}"` : 
                       'No users found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add New User</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>User ID</label>
                  <input
                    type="text"
                    value={userId}
                    placeholder="Enter user ID"
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    placeholder="Enter first name"
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    placeholder="Enter last name"
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
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

                {role !== 'admin' && (
                  <div className="form-group">
                    <label>Department</label>
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

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Edit User</h3>
              <form onSubmit={handleUpdateUser}>
                <div className="form-group">
                  <label>User ID</label>
                  <input
                    type="text"
                    value={selectedUser.userId}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={selectedUser.firstName}
                    onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={selectedUser.lastName}
                    onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {selectedUser.role !== 'admin' && (
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      value={selectedUser.department}
                      onChange={(e) => setSelectedUser({ ...selectedUser, departmentId: e.target.value })}
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
                    onClick={() => {
                      setSelectedUser(null);
                      setShowEditModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="submit-btn" type="submit">
                    Update User
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