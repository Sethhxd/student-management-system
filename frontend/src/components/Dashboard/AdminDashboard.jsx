import React, { useState, useEffect } from "react";
import { getCourses, createCourse, getUsers } from "../../utils/api";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    description: "",
    credits: 3,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, usersRes] = await Promise.all([
        getCourses(),
        getUsers(),
      ]);
      setCourses(coursesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCourse(newCourse);
      toast.success("Course created successfully");
      setNewCourse({ code: "", name: "", description: "", credits: 3 });
      setShowCourseForm(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Courses Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Courses</h2>
            <button
              onClick={() => setShowCourseForm(!showCourseForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Add Course
            </button>
          </div>

          {showCourseForm && (
            <form onSubmit={handleCreateCourse} className="mb-6 space-y-3">
              <input
                type="text"
                placeholder="Course Code"
                value={newCourse.code}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, code: e.target.value })
                }
                required
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Course Name"
                value={newCourse.name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
                required
                className="w-full px-3 py-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Credits"
                value={newCourse.credits}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    credits: parseInt(e.target.value),
                  })
                }
                required
                className="w-full px-3 py-2 border rounded"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {loading ? "Creating..." : "Create Course"}
              </button>
            </form>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {courses.map((course) => (
              <div key={course.id} className="border rounded p-3">
                <div className="font-semibold">{course.name}</div>
                <div className="text-sm text-gray-600">{course.code}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Teacher: {course.teacher_name || "Not assigned"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div key={user.id} className="border rounded p-3">
                <div className="font-semibold">{user.username}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-xs text-gray-500">
                  Role: {user.role} | Name: {user.first_name} {user.last_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
