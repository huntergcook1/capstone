import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
    // State to hold the list of courses
    const [courses, setCourses] = useState([]);
    // State to simulate user login status
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // State to simulate admin role
    const [isAdmin, setIsAdmin] = useState(false);
    // State to control visibility of the add/edit course form
    const [showAddEditForm, setShowAddEditForm] = useState(false);
    // State to hold the course being edited (null for new course)
    const [editingCourse, setEditingCourse] = useState(null);
    // State for the search query
    const [searchQuery, setSearchQuery] = useState('');
    // State for displaying messages (success/error)
    const [message, setMessage] = useState('');
    // State for loading indicator
    const [loading, setLoading] = useState(false);

    // Mock initial course data
    const initialCourses = [
        { id: '1', name: 'Introduction to React', description: 'Learn the basics of React development and component-based architecture.', instructor: 'Alice Smith', capacity: 30, enrolled: 25 },
        { id: '2', name: 'Advanced JavaScript', description: 'Deep dive into modern JavaScript features, ES6+, and asynchronous programming.', instructor: 'Bob Johnson', capacity: 20, enrolled: 18 },
        { id: '3', name: 'CSS Fundamentals', description: 'Master styling web pages with CSS, including Flexbox and Grid.', instructor: 'Charlie Brown', capacity: 40, enrolled: 35 },
        { id: '4', name: 'Node.js for Beginners', description: 'Build server-side applications and REST APIs using Node.js and Express.', instructor: 'Diana Prince', capacity: 25, enrolled: 20 },
        { id: '5', name: 'Database Design with SQL', description: 'Understand relational database concepts and SQL queries.', instructor: 'Eve Adams', capacity: 35, enrolled: 30 },
        { id: '6', name: 'Mobile App Development with React Native', description: 'Develop cross-platform mobile applications using React Native.', instructor: 'Frank White', capacity: 20, enrolled: 15 },
    ];

    // Simulate fetching courses from a backend API
    const fetchCourses = async () => {
        setLoading(true);
        setMessage('');
        try {
            // In a real application, you would replace this with a fetch call to your backend:
            // const response = await fetch('/api/courses');
            // const data = await response.json();
            // setCourses(data);

            // Mocking API call with a delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setCourses(initialCourses); // Using mock data
            setMessage('Courses loaded successfully!');
        } catch (error) {
            console.error('Error fetching courses:', error);
            setMessage('Failed to load courses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Simulate enrolling in a course
    const enrollInCourse = async (courseId) => {
        setLoading(true);
        setMessage('');
        try {
            // In a real application, you would replace this with a fetch call to your backend:
            // const response = await fetch(`/api/courses/${courseId}/enroll`, { method: 'POST' });
            // if (!response.ok) throw new Error('Failed to enroll');

            // Mocking API call with a delay
            await new Promise(resolve => setTimeout(resolve, 500));

            setCourses(prevCourses =>
                prevCourses.map(course =>
                    course.id === courseId && course.enrolled < course.capacity
                        ? { ...course, enrolled: course.enrolled + 1 }
                        : course
                )
            );
            setMessage(`Successfully enrolled in course ID: ${courseId}!`);
        } catch (error) {
            console.error('Error enrolling:', error);
            setMessage('Failed to enroll in course. It might be full or an error occurred.');
        } finally {
            setLoading(false);
        }
    };

    // Simulate adding a new course
    const addCourse = async (newCourse) => {
        setLoading(true);
        setMessage('');
        try {
            // In a real application, you would replace this with a fetch call to your backend:
            // const response = await fetch('/api/courses', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(newCourse),
            // });
            // const data = await response.json();

            // Mocking API call with a delay and assigning a new ID
            await new Promise(resolve => setTimeout(resolve, 500));
            const courseWithId = { ...newCourse, id: String(Date.now()), enrolled: 0 };
            setCourses(prevCourses => [...prevCourses, courseWithId]);
            setMessage(`Course "${newCourse.name}" added successfully!`);
            setShowAddEditForm(false);
        } catch (error) {
            console.error('Error adding course:', error);
            setMessage('Failed to add course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Simulate updating an existing course
    const updateCourse = async (updatedCourse) => {
        setLoading(true);
        setMessage('');
        try {
            // In a real application, you would replace this with a fetch call to your backend:
            // const response = await fetch(`/api/courses/${updatedCourse.id}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(updatedCourse),
            // });
            // if (!response.ok) throw new Error('Failed to update');

            // Mocking API call with a delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setCourses(prevCourses =>
                prevCourses.map(course =>
                    course.id === updatedCourse.id ? updatedCourse : course
                )
            );
            setMessage(`Course "${updatedCourse.name}" updated successfully!`);
            setShowAddEditForm(false);
            setEditingCourse(null);
        } catch (error) {
            console.error('Error updating course:', error);
            setMessage('Failed to update course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Simulate deleting a course (Admin only)
    const deleteCourse = async (courseId) => {
        setLoading(true);
        setMessage('');
        try {
            // In a real application, you would replace this with a fetch call to your backend:
            // const response = await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
            // if (!response.ok) throw new Error('Failed to delete');

            // Mocking API call with a delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
            setMessage(`Course ID: ${courseId} deleted successfully!`);
        } catch (error) {
            console.error('Error deleting course:', error);
            setMessage('Failed to delete course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch courses on initial component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    // Filter courses based on search query
    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Component for the Course Form (Add/Edit)
    const CourseForm = ({ courseToEdit, onSubmit, onCancel }) => {
        const [formData, setFormData] = useState(
            courseToEdit || { name: '', description: '', instructor: '', capacity: '', enrolled: 0 }
        );

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: name === 'capacity' || name === 'enrolled' ? Number(value) : value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(formData);
        };

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                        {courseToEdit ? 'Edit Course' : 'Add New Course'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Course Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">Instructor</label>
                            <input
                                type="text"
                                id="instructor"
                                name="instructor"
                                value={formData.instructor}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
                            <input
                                type="number"
                                id="capacity"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                                min="1"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        {courseToEdit && (
                            <div>
                                <label htmlFor="enrolled" className="block text-sm font-medium text-gray-700">Enrolled Students</label>
                                <input
                                    type="number"
                                    id="enrolled"
                                    name="enrolled"
                                    value={formData.enrolled}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    max={formData.capacity}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        )}
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                            >
                                {courseToEdit ? 'Update Course' : 'Add Course'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col">
            {/* Tailwind CSS CDN */}
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                }
                `}
            </style>

            {/* Header */}
            <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center rounded-b-lg">
                <h1 className="text-3xl font-bold mb-2 sm:mb-0">Course Management</h1>
                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <>
                            <span className="text-lg">
                                {isAdmin ? 'Admin View' : 'Student View'}
                            </span>
                            <button
                                onClick={() => setIsAdmin(prev => !prev)}
                                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-md shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Switch to {isAdmin ? 'Student' : 'Admin'}
                            </button>
                            <button
                                onClick={() => { setIsLoggedIn(false); setIsAdmin(false); setMessage(''); }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsLoggedIn(true)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Login
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="container mx-auto p-4 md:p-8 flex-grow">
                {/* Message Display */}
                {message && (
                    <div className={`p-4 mb-4 rounded-md text-center ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message}
                    </div>
                )}

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <span className="ml-3 text-lg text-gray-700">Loading...</span>
                    </div>
                )}

                {/* Conditional Rendering based on Login and Admin Status */}
                {isLoggedIn ? (
                    isAdmin ? (
                        /* Admin View */
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Admin Dashboard</h2>
                            <button
                                onClick={() => { setShowAddEditForm(true); setEditingCourse(null); }}
                                className="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Add New Class
                            </button>

                            {showAddEditForm && (
                                <CourseForm
                                    courseToEdit={editingCourse}
                                    onSubmit={editingCourse ? updateCourse : addCourse}
                                    onCancel={() => { setShowAddEditForm(false); setEditingCourse(null); }}
                                />
                            )}

                            <h3 className="text-xl font-medium mb-4 text-gray-700">All Courses</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled/Capacity</th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredCourses.length > 0 ? (
                                            filteredCourses.map(course => (
                                                <tr key={course.id} className="hover:bg-gray-50">
                                                    <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
                                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{course.instructor}</td>
                                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                                                        {course.enrolled}/{course.capacity}
                                                    </td>
                                                    <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => { setEditingCourse(course); setShowAddEditForm(true); }}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-150 ease-in-out"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => deleteCourse(course.id)}
                                                            className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-4 px-6 text-center text-gray-500">No courses found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        /* Student View */
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Available Courses</h2>
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Search courses by name, instructor, or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map(course => (
                                        <div key={course.id} className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col justify-between transform transition duration-300 hover:scale-105 hover:shadow-lg">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
                                                <p className="text-gray-700 mb-3 text-sm">{course.description}</p>
                                                <p className="text-gray-600 text-sm mb-1"><strong>Instructor:</strong> {course.instructor}</p>
                                                <p className="text-gray-600 text-sm mb-4">
                                                    <strong>Capacity:</strong> {course.enrolled}/{course.capacity}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => enrollInCourse(course.id)}
                                                disabled={course.enrolled >= course.capacity || loading}
                                                className={`w-full px-4 py-2 rounded-md font-semibold text-white transition duration-200 ease-in-out transform hover:scale-105
                                                    ${course.enrolled >= course.capacity
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                                    }`}
                                            >
                                                {course.enrolled >= course.capacity ? 'Full' : 'Enroll'}
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-gray-500 text-lg py-10">No courses match your search or are currently available.</p>
                                )}
                            </div>
                        </div>
                    )
                ) : (
                    /* Not Logged In View */
                    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md max-w-md mx-auto mt-10">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Welcome!</h2>
                        <p className="text-gray-700 mb-6 text-center">Please log in to view and manage courses.</p>
                        <button
                            onClick={() => setIsLoggedIn(true)}
                            className="px-6 py-3 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Login to Continue
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center p-4 mt-8 rounded-t-lg">
                <p>&copy; 2024 Course Management System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
