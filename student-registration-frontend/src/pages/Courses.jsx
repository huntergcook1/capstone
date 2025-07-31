import React, { useEffect, useState } from 'react';

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form, setForm] = useState({
    course_code: '',
    course_name: '',
    description: '',
    credits: '',
    tuition_fees: '',
    capacity: ''
  });

  // Fetch courses
  useEffect(() => {
    fetch('http://localhost:5000/api/courses', {
      headers: {
        Authorization: user?.token ? `Bearer ${user.token}` : undefined
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add course
  const handleAddCourse = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(form)
    })
      .then((res) => res.json())
      .then(() => {
        setShowAddForm(false);
        setLoading(true);
        // Refresh courses
        fetch('http://localhost:5000/api/courses', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
          .then((res) => res.json())
          .then((data) => {
            setCourses(data);
            setLoading(false);
          });
      });
  };

  // Edit course
  const handleEditCourse = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/courses/${editCourse.course_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(form)
    })
      .then((res) => res.json())
      .then(() => {
        setShowEditForm(false);
        setEditCourse(null);
        setLoading(true);
        // Refresh courses
        fetch('http://localhost:5000/api/courses', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
          .then((res) => res.json())
          .then((data) => {
            setCourses(data);
            setLoading(false);
          });
      });
  };

  // Start editing
  const startEdit = (course) => {
    setEditCourse(course);
    setForm({
      course_code: course.course_code,
      course_name: course.course_name,
      description: course.description,
      credits: course.credits,
      tuition_fees: course.tuition_fees,
      capacity: course.capacity
    });
    setShowEditForm(true);
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }

  return (
    <div>
      <h1>Courses</h1>
      {user?.role === 'admin' && (
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Course'}
        </button>
      )}

      {showAddForm && (
        <form onSubmit={handleAddCourse}>
          <input name="course_code" placeholder="Course Code" value={form.course_code} onChange={handleChange} required />
          <input name="course_name" placeholder="Course Name" value={form.course_name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input name="credits" type="number" placeholder="Credits" value={form.credits} onChange={handleChange} required />
          <input name="tuition_fees" type="number" placeholder="Tuition Fees" value={form.tuition_fees} onChange={handleChange} required />
          <input name="capacity" type="number" placeholder="Capacity" value={form.capacity} onChange={handleChange} required />
          <button type="submit">Add</button>
        </form>
      )}

      {showEditForm && (
        <form onSubmit={handleEditCourse}>
          <input name="course_code" placeholder="Course Code" value={form.course_code} onChange={handleChange} required />
          <input name="course_name" placeholder="Course Name" value={form.course_name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input name="credits" type="number" placeholder="Credits" value={form.credits} onChange={handleChange} required />
          <input name="tuition_fees" type="number" placeholder="Tuition Fees" value={form.tuition_fees} onChange={handleChange} required />
          <input name="capacity" type="number" placeholder="Capacity" value={form.capacity} onChange={handleChange} required />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
        </form>
      )}

      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.course_id}>
              <strong>{course.course_name}</strong> - {course.description}
              {user?.role === 'admin' && (
                <button onClick={() => startEdit(course)}>Edit</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Courses;