import React, { useState, useEffect } from "react";
import GradeEntry from "../Grades/GradeEntry";
import toast from "react-hot-toast";
import api from "../../utils/api";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  const fetchCourses = async () => {
    const token = localStorage.getItem("access_token");
    console.log("Token exists:", !!token);

    if (!token) {
      console.log("No token, waiting...");
      return;
    }

    try {
      const response = await api.get("/courses/teacher/");
      console.log("Courses:", response.data);
      setCourses(response.data);
    } catch (error) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/users/students/");
      setStudents(response.data);
    } catch (error) {
      toast.error("Failed to fetch students");
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedStudent) {
      toast.error("Please select a course and student");
      return;
    }

    setEnrolling(true);
    try {
      await api.post(`/courses/${selectedCourse.id}/enroll/`, {
        student_id: selectedStudent,
      });
      toast.success(`Student enrolled in ${selectedCourse.name}`);
      setSelectedStudent("");
      setShowEnrollForm(false);
      // Refresh course data to show updated enrollment
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to enroll student");
    } finally {
      setEnrolling(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Teacher Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course List */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">My Courses</h2>
            <div className="space-y-2">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowEnrollForm(false);
                  }}
                  className={`w-full text-left p-3 rounded transition ${
                    selectedCourse?.id === course.id
                      ? "bg-blue-100 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium">{course.name}</div>
                  <div className="text-sm text-gray-600">{course.code}</div>
                </button>
              ))}
            </div>
            {courses.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No courses assigned
              </p>
            )}
          </div>
        </div>

        {/* Grade Entry & Enrollment Section */}
        <div className="lg:col-span-2">
          {selectedCourse ? (
            <div className="space-y-6">
              {/* Grade Entry Component */}
              <GradeEntry course={selectedCourse} onGradeAdded={fetchCourses} />
              
              {/* Enroll Student Section */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Enroll Students</h3>
                  <button
                    onClick={() => setShowEnrollForm(!showEnrollForm)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {showEnrollForm ? "Cancel" : "+ Enroll Student"}
                  </button>
                </div>
                
                {showEnrollForm && (
                  <form onSubmit={handleEnrollStudent} className="space-y-3">
                    <select 
                      value={selectedStudent} 
                      onChange={(e) => setSelectedStudent(e.target.value)} 
                      required 
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Student</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.username} {s.email ? `(${s.email})` : ""}
                        </option>
                      ))}
                    </select>
                    <button 
                      type="submit" 
                      disabled={enrolling}
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling ? "Enrolling..." : `Enroll in ${selectedCourse?.name}`}
                    </button>
                  </form>
                )}
                
                {/* Display enrolled students count */}
                {selectedCourse.enrolled_students_count !== undefined && (
                  <div className="mt-3 text-sm text-gray-600">
                    Currently enrolled: {selectedCourse.enrolled_students_count} students
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
              Select a course to enter grades or enroll students
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;