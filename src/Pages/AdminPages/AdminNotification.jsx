import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../Components/WebPage/Navbar/Navbar';
import Navtabs from '../../Components/Admin/Navtabs/Navtabs';
import Footer from '../../Components/WebPage/Footer/Footer';
import './styles/AdminNotification.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    recipient: 'all',
    priority: 'medium'
  });
  const [activeTab, setActiveTab] = useState('inbox');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  // Sample notifications data
  useEffect(() => {
    const sampleNotifications = [
      {
        id: 1,
        title: 'System Maintenance',
        message: 'There will be scheduled maintenance this weekend.',
        sender: 'System Admin',
        recipient: 'all',
        date: '2023-05-20 14:30',
        priority: 'high',
        read: false,
        type: 'sent'
      },
      {
        id: 2,
        title: 'New Feature Request',
        message: 'Can we add a dark mode to the interface?',
        sender: 'User123',
        recipient: 'Admin',
        date: '2023-05-21 09:15',
        priority: 'medium',
        read: true,
        type: 'received'
      },
      {
        id: 3,
        title: 'Bug Report',
        message: 'The dashboard crashes when filtering by date.',
        sender: 'User456',
        recipient: 'Admin',
        date: '2023-05-22 11:45',
        priority: 'high',
        read: false,
        type: 'received'
      }
    ];
    setNotifications(sampleNotifications);
  }, []);

  const handleSendNotification = () => {
    if (newNotification.title && newNotification.message) {
      const notification = {
        id: notifications.length + 1,
        title: newNotification.title,
        message: newNotification.message,
        sender: 'Admin',
        recipient: newNotification.recipient,
        date: new Date().toISOString(),
        priority: newNotification.priority,
        read: false,
        type: 'sent'
      };
      setNotifications([notification, ...notifications]);
      setNewNotification({
        title: '',
        message: '',
        recipient: 'all',
        priority: 'medium'
      });
    }
  };

  const handleReply = (notification) => {
    setReplyingTo(notification);
  };

  const sendReply = () => {
    if (replyContent && replyingTo) {
      const replyNotification = {
        id: notifications.length + 1,
        title: `Re: ${replyingTo.title}`,
        message: replyContent,
        sender: 'Admin',
        recipient: replyingTo.sender,
        date: new Date().toISOString(),
        priority: 'medium',
        read: false,
        type: 'sent'
      };
      setNotifications([replyNotification, ...notifications]);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => 
    activeTab === 'inbox' ? notification.type === 'received' : notification.type === 'sent'
  );

  return (
    <div className="admin-container">
      <Navbar/>
      <Navtabs/>
      <div className="admin-content">
        
        
        <div className="notifications-container">
          <h2 className="mb-4">Notifications Center</h2>
          
          <div className="notification-tabs mb-4">
            <button 
              className={`tab-btn ${activeTab === 'inbox' ? 'active' : ''}`}
              onClick={() => setActiveTab('inbox')}
            >
              Inbox ({notifications.filter(n => n.type === 'received').length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
              onClick={() => setActiveTab('sent')}
            >
              Sent ({notifications.filter(n => n.type === 'sent').length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'compose' ? 'active' : ''}`}
              onClick={() => setActiveTab('compose')}
            >
              New Notification
            </button>
          </div>
          
          {activeTab === 'compose' ? (
            <div className="compose-notification">
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Message</label>
                <textarea 
                  className="form-control"
                  rows="5"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Recipient</label>
                  <select 
                    className="form-control"
                    value={newNotification.recipient}
                    onChange={(e) => setNewNotification({...newNotification, recipient: e.target.value})}
                  >
                    <option value="all">All Users</option>
                    <option value="specific">Specific User</option>
                    <option value="admins">Admins Only</option>
                  </select>
                </div>
                
                <div className="form-group col-md-6">
                  <label>Priority</label>
                  <select 
                    className="form-control"
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification({...newNotification, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <button 
                className="btn btn-primary mt-3"
                onClick={handleSendNotification}
              >
                Send Notification
              </button>
            </div>
          ) : replyingTo ? (
            <div className="reply-section">
              <h4>Replying to: {replyingTo.title}</h4>
              <div className="original-message mb-3 p-3 bg-light">
                <strong>{replyingTo.sender} wrote:</strong>
                <p>{replyingTo.message}</p>
              </div>
              
              <textarea
                className="form-control mb-3"
                rows="5"
                placeholder="Type your reply here..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              ></textarea>
              
              <div className="d-flex justify-content-end">
                <button 
                  className="btn btn-secondary mr-2"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={sendReply}
                >
                  Send Reply
                </button>
              </div>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.length === 0 ? (
                <div className="no-notifications">
                  <p>No {activeTab} notifications</p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.priority} ${!notification.read ? 'unread' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="notification-header">
                      <h5>{notification.title}</h5>
                      <div className="notification-actions">
                        {activeTab === 'inbox' && (
                          <button 
                            className="btn btn-sm btn-outline-primary mr-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReply(notification);
                            }}
                          >
                            Reply
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="notification-meta">
                      <span>
                        {activeTab === 'inbox' ? `From: ${notification.sender}` : `To: ${notification.recipient}`}
                      </span>
                      <span>{new Date(notification.date).toLocaleString()}</span>
                    </div>
                    <div className="notification-body">
                      <p>{notification.message}</p>
                    </div>
                    {!notification.read && <span className="badge badge-primary">New</span>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer/>
    </div>
  );
}