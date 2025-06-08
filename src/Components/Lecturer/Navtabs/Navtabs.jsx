import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import "./L-Navtabs.css";

export default function Navtabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState("");

  // Update active key based on current location
  useEffect(() => {
    const path = location.pathname;

    if (path === "/lecture" || path === "/lecturer/") {
      setActiveKey("home");
    } else if (path.includes("/lecturer/dashboard")) {
      setActiveKey("dashboard");
    } else if (path.includes("/admin/users")) {
      setActiveKey("users");
    } else if (path.includes("/admin/courses")) {
      setActiveKey("courses");
    } else if (path.includes("/admin/marks")) {
      setActiveKey("marks");
    } else if (path.includes("/admin/notification")) {
      setActiveKey("notification");
    } else if (path.includes("/admin/setting")) {
      setActiveKey("setting");
    } else {
      setActiveKey("");
    }
  }, [location.pathname]);

  // Handle navigation when nav items are clicked
  const handleNavigation = (eventKey) => {
    setActiveKey(eventKey); // Set active state immediately

    switch (eventKey) {
      case "home":
        navigate("/lecturer");
        break;
      case "dashboard":
        navigate("/lecturer/dashboard");
        break;
      case "users":
        navigate("/admin/users");
        break;
      case "courses":
        navigate("/admin/courses");
        break;
      case "marks":
        navigate("/admin/marks");
        break;
      case "notification":
        navigate("/admin/notification");
        break;
      case "setting":
        navigate("/admin/setting");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="nav-wrapper">
      <Container
        fluid
        className="px-5 d-flex justify-content-between align-items-center flex-wrap"
      >
        {/* Nav tabs section */}
        <Nav
          variant="underline"
          className="nav-scrollable ms-auto mb-2 mb-md-0 custom-nav"
          activeKey={activeKey}
          onSelect={handleNavigation}
        >
          <Nav.Item>
            <Nav.Link eventKey="setting">Setting</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="notification">Notification</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="marks">Marks</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="courses">Courses</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="users">Users</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="home">Home</Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </div>
  );
}
