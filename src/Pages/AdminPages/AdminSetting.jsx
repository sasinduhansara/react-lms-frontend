import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../Components/WebPage/Navbar/Navbar';
import Navtabs from '../../Components/Admin/Navtabs/Navtabs';
import Footer from '../../Components/WebPage/Footer/Footer';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [settings, setSettings] = useState({
    // System Settings
    siteName: 'Learning Management System',
    timezone: 'UTC',
    maintenanceMode: false,
    
    // User Management
    userRegistration: true,
    defaultUserRole: 'student',
    
    // Course Settings
    maxFileSize: 100, // MB
    allowedFileTypes: ['pdf', 'docx', 'mp4', 'jpg', 'png'],
    
    // Notification Settings
    emailNotifications: true,
    notifyOnEnrollment: true,
    notifyOnCompletion: true,
    
    // Certificate Settings
    certificateTemplate: 'default',
    autoGenerateCertificates: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings saved:', settings);
    // API call to save settings would go here
    alert('Settings saved successfully!');
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Admin Settings</h2>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            System
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            Certificates
          </button>
        </li>
      </ul>

      <form onSubmit={handleSubmit}>
        {/* System Settings Tab */}
        {activeTab === 'system' && (
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Site Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Timezone</label>
                  <select
                    className="form-select"
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleChange}
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="PST">Pacific Time (PST)</option>
                    <option value="CET">Central European Time (CET)</option>
                  </select>
                </div>
              </div>
              
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  id="maintenanceMode"
                />
                <label className="form-check-label" htmlFor="maintenanceMode">
                  Maintenance Mode (disable for all non-admin users)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="card-body">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="userRegistration"
                  checked={settings.userRegistration}
                  onChange={handleChange}
                  id="userRegistration"
                />
                <label className="form-check-label" htmlFor="userRegistration">
                  Allow User Registration
                </label>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Default User Role</label>
                <select
                  className="form-select"
                  name="defaultUserRole"
                  value={settings.defaultUserRole}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Course Settings Tab */}
        {activeTab === 'courses' && (
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Maximum File Upload Size (MB)</label>
                <input
                  type="number"
                  className="form-control"
                  name="maxFileSize"
                  value={settings.maxFileSize}
                  onChange={handleChange}
                  min="1"
                  max="500"
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Allowed File Types</label>
                <div className="form-check">
                  {settings.allowedFileTypes.map(type => (
                    <div key={type} className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`fileType-${type}`}
                        checked={settings.allowedFileTypes.includes(type)}
                        onChange={() => {
                          const updatedTypes = settings.allowedFileTypes.includes(type)
                            ? settings.allowedFileTypes.filter(t => t !== type)
                            : [...settings.allowedFileTypes, type];
                          setSettings(prev => ({ ...prev, allowedFileTypes: updatedTypes }));
                        }}
                      />
                      <label className="form-check-label" htmlFor={`fileType-${type}`}>
                        .{type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings Tab */}
        {activeTab === 'notifications' && (
          <div className="card">
            <div className="card-body">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  id="emailNotifications"
                />
                <label className="form-check-label" htmlFor="emailNotifications">
                  Enable Email Notifications
                </label>
              </div>
              
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="notifyOnEnrollment"
                  checked={settings.notifyOnEnrollment}
                  onChange={handleChange}
                  id="notifyOnEnrollment"
                />
                <label className="form-check-label" htmlFor="notifyOnEnrollment">
                  Notify Students on Course Enrollment
                </label>
              </div>
              
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="notifyOnCompletion"
                  checked={settings.notifyOnCompletion}
                  onChange={handleChange}
                  id="notifyOnCompletion"
                />
                <label className="form-check-label" htmlFor="notifyOnCompletion">
                  Notify Students on Course Completion
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Settings Tab */}
        {activeTab === 'certificates' && (
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Certificate Template</label>
                <select
                  className="form-select"
                  name="certificateTemplate"
                  value={settings.certificateTemplate}
                  onChange={handleChange}
                >
                  <option value="default">Default Template</option>
                  <option value="modern">Modern Template</option>
                  <option value="classic">Classic Template</option>
                </select>
              </div>
              
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="autoGenerateCertificates"
                  checked={settings.autoGenerateCertificates}
                  onChange={handleChange}
                  id="autoGenerateCertificates"
                />
                <label className="form-check-label" htmlFor="autoGenerateCertificates">
                  Automatically Generate Certificates on Course Completion
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-end mt-4">
          <button type="submit" className="btn btn-primary px-4">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default function AdminPage() {
  return (
    <div>
      <Navbar/>
      <Navtabs/>
      <AdminSettings/>
      <Footer/>
    </div>
  )
}