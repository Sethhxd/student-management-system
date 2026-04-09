import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../utils/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showUserForm, setShowUserForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    role: "student",
    department: "",
  });

  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    credits: 3,
    description: "",
    teacher: "",
  });

  const [newDepartment, setNewDepartment] = useState({
    name: "",
    code: "",
    description: "",
  });

  const [assignData, setAssignData] = useState({
    course: "",
    teacher: "",
    student: "",
    department: "",
  });

  // Fetch all data
  const fetchData = async () => {
    try {
      const [usersRes, coursesRes, deptsRes] = await Promise.all([
        api.get("/auth/users/"),
        api.get("/courses/"),
        api.get("/departments/"),
      ]);
      setUsers(usersRes.data);
      setCourses(coursesRes.data);
      setDepartments(deptsRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // User CRUD
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register/", newUser);
      toast.success("User created successfully");
      setNewUser({
        username: "",
        email: "",
        password: "",
        password2: "",
        role: "student",
        department: "",
      });
      setShowUserForm(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to create user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/auth/users/${userId}/`);
        toast.success("User deleted");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  // Course CRUD
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post("/courses/", newCourse);
      toast.success("Course created");
      setNewCourse({
        code: "",
        name: "",
        credits: 3,
        description: "",
        teacher: "",
      });
      setShowCourseForm(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to create course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/courses/${courseId}/`);
        toast.success("Course deleted");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  // Assign teacher to course
  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/courses/${assignData.course}/`, {
        teacher: assignData.teacher,
      });
      toast.success("Teacher assigned to course");
      setAssignData({ course: "", teacher: "", student: "", department: "" });
      setShowAssignForm(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to assign teacher");
    }
  };

  // Enroll student (Admin)
  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/grades/enroll/", {
        student: assignData.student,
        course: assignData.course,
      });
      toast.success("Student enrolled");
      setAssignData({ course: "", teacher: "", student: "", department: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to enroll student");
    }
  };

  // Department CRUD
  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await api.post("/departments/", newDepartment);
      toast.success("Department created");
      setNewDepartment({ name: "", code: "", description: "" });
      setShowDepartmentForm(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to create department");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter users by role
  const teachers = users.filter((u) => u.role === "teacher");
  const students = users.filter((u) => u.role === "student");
  const admins = users.filter((u) => u.role === "admin");

  const stats = {
    totalUsers: users.length,
    teachers: teachers.length,
    students: students.length,
    totalCourses: courses.length,
    departments: departments.length,
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Admins</h3>
          <p className="text-2xl font-bold text-red-600">{admins.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Teachers</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.teachers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Students</h3>
          <p className="text-2xl font-bold text-green-600">{stats.students}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Courses</h3>
          <p className="text-2xl font-bold text-purple-600">
            {stats.totalCourses}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Departments</h3>
          <p className="text-2xl font-bold text-orange-600">
            {stats.departments}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => {
            setShowUserForm(!showUserForm);
            setShowCourseForm(false);
            setShowDepartmentForm(false);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add User
        </button>
        <button
          onClick={() => {
            setShowCourseForm(!showCourseForm);
            setShowUserForm(false);
            setShowDepartmentForm(false);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Course
        </button>
        <button
          onClick={() => {
            setShowDepartmentForm(!showDepartmentForm);
            setShowUserForm(false);
            setShowCourseForm(false);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          + Add Department
        </button>
        <button
          onClick={() => {
            setShowAssignForm(!showAssignForm);
            setShowDepartmentForm(false);
            setShowUserForm(false);
            setShowCourseForm(false);
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Assign Teacher/Course
        </button>
      </div>

      {/* Forms */}
      {showUserForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-3">Create New User</h3>
          <form onSubmit={handleCreateUser} className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={newUser.password2}
              onChange={(e) =>
                setNewUser({ ...newUser, password2: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="First Name"
              value={newUser.first_name}
              onChange={(e) =>
                setNewUser({ ...newUser, first_name: e.target.value })
              }
              className="w-full p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={newUser.last_name}
              onChange={(e) =>
                setNewUser({ ...newUser, last_name: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={newUser.department}
              onChange={(e) =>
                setNewUser({ ...newUser, department: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create User
            </button>
          </form>
        </div>
      )}

      {/* Course Form */}
      {showCourseForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-3">Create New Course</h3>
          <form onSubmit={handleCreateCourse} className="space-y-3">
            <input
              type="text"
              placeholder="Course Code (e.g., CS101)"
              value={newCourse.code}
              onChange={(e) =>
                setNewCourse({ ...newCourse, code: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse.name}
              onChange={(e) =>
                setNewCourse({ ...newCourse, name: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Description (optional)"
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
              className="w-full p-2 border rounded"
              rows="2"
            />
            <select
              value={newCourse.teacher}
              onChange={(e) =>
                setNewCourse({ ...newCourse, teacher: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Assign Teacher (Optional)</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.username}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create Course
              </button>
              <button
                type="button"
                onClick={() => setShowCourseForm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Department Form */}
      {showDepartmentForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-3">Create New Department</h3>
          <form onSubmit={handleCreateDepartment} className="space-y-3">
            <input
              type="text"
              placeholder="Department Code (e.g., CS)"
              value={newDepartment.code}
              onChange={(e) =>
                setNewDepartment({ ...newDepartment, code: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Department Name (e.g., Computer Science)"
              value={newDepartment.name}
              onChange={(e) =>
                setNewDepartment({ ...newDepartment, name: e.target.value })
              }
              required
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Description (optional)"
              value={newDepartment.description}
              onChange={(e) =>
                setNewDepartment({
                  ...newDepartment,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              rows="2"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Create Department
              </button>
              <button
                type="button"
                onClick={() => setShowDepartmentForm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-medium ${activeTab === "users" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
        >
          All Users
        </button>
        <button
          onClick={() => setActiveTab("teachers")}
          className={`px-4 py-2 font-medium ${activeTab === "teachers" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
        >
          Teachers
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2 font-medium ${activeTab === "students" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 font-medium ${activeTab === "courses" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
        >
          Courses
        </button>
        <button
          onClick={() => setActiveTab("departments")}
          className={`px-4 py-2 font-medium ${activeTab === "departments" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
        >
          Departments
        </button>
      </div>

      {/* Users Table */}
      {(activeTab === "users" ||
        activeTab === "teachers" ||
        activeTab === "students") && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "users"
                ? users
                : activeTab === "teachers"
                  ? teachers
                  : students
              ).map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm">{user.username}</td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm capitalize">{user.role}</td>
                  <td className="px-6 py-4 text-sm">
                    {user.department_name || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Courses Table */}
      {activeTab === "courses" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 text-sm">{course.code}</td>
                  <td className="px-6 py-4 text-sm">{course.name}</td>
                  <td className="px-6 py-4 text-sm">
                    {course.teacher_name || "Not assigned"}
                  </td>
                  <td className="px-6 py-4 text-sm">{course.credits}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Departments Table */}
      {activeTab === "departments" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td className="px-6 py-4 text-sm">{dept.code}</td>
                  <td className="px-6 py-4 text-sm">{dept.name}</td>
                  <td className="px-6 py-4 text-sm">
                    {dept.description || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Form Modal */}
      {showAssignForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="font-bold text-lg mb-4">Assign Teacher to Course</h3>
            <form onSubmit={handleAssignTeacher} className="space-y-3">
              <select
                value={assignData.course}
                onChange={(e) =>
                  setAssignData({ ...assignData, course: e.target.value })
                }
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
              <select
                value={assignData.teacher}
                onChange={(e) =>
                  setAssignData({ ...assignData, teacher: e.target.value })
                }
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.username}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Assign
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignForm(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>

            <hr className="my-4" />

            <h3 className="font-bold text-lg mb-4">Enroll Student</h3>
            <form onSubmit={handleEnrollStudent} className="space-y-3">
              <select
                value={assignData.course}
                onChange={(e) =>
                  setAssignData({ ...assignData, course: e.target.value })
                }
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
              <select
                value={assignData.student}
                onChange={(e) =>
                  setAssignData({ ...assignData, student: e.target.value })
                }
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.username}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Enroll
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
