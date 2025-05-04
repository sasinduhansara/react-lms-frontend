// components/Courses/Courses.js

import React from 'react';
import './Courses2.css';

const courseData = [
  {
    id: 1,
    title: 'Higher National Diploma in Accountancy - (HNDA)',
    image: '/CoursesCart/lms1.jpg',
  },
  {
    id: 2,
    title: 'Higher National Diploma in English - (HNDE)',
    image: '/CoursesCart/lms2.png',
  },
  {
    id: 3,
    title: 'Higher National Diploma in Information Technology - (HNDIT)',
    image: '/CoursesCart/lms3.jpg',
  },
  {
    id: 4,
    title: 'Higher National Diploma in Management - (HNDM)',
    image: '/CoursesCart/lms4.jpg',
  },
];

export default function Courses() {
  return (
    <div className="courses-wrapper-admin px-5 py-4">
      <h2 className="section-title mb-4 fw-bold">Active Courses</h2>
      <div className="row gy-4">
        {courseData.map((course) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={course.id}>
            <div className="course-card shadow-sm p-3 rounded text-center">
              <img src={course.image} alt={course.title} className="course-image mb-3 rounded" />
              <h5 className="course-title">{course.title}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
