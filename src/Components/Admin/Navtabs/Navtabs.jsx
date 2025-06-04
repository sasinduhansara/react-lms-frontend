import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navtabs.css';
//import axios from 'axios';


export default function Navtabs() {
  const navigate = useNavigate();

  // Handle navigation when nav items are clicked
  const handleNavigation = (eventKey) => {
    switch(eventKey) {
      case 'home':
        navigate('/admin');
        break;
      case 'dashboard':
        navigate('/admin/dashboard');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'courses':
        navigate('/admin/courses');
        break;
      case 'marks':
        navigate('/admin/marks');
        break;
      case 'notification':
        navigate('/admin/notification');
        break;
      case'setting':
        navigate('/admin/setting');
        break;

      // Add more cases as needed
      default:
        navigate('/');
    }
  };

  return (
    <div className="nav-wrapper">
      <Container fluid className="px-5 d-flex justify-content-between align-items-center flex-wrap">
      
        {/* Nav tabs section */}
        <Nav
          variant="underline"
          className="nav-scrollable ms-auto mb-2 mb-md-0 custom-nav"
          onSelect={handleNavigation}
        >
          <Nav.Item><Nav.Link eventKey="setting">Setting</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="notification">Notification</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="marks">Marks</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="courses">Courses</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="users">Users</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="dashboard">Dashboard</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="home">Home</Nav.Link></Nav.Item>
        </Nav>
      </Container>
    </div>
  );
}