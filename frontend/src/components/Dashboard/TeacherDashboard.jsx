import React, { useState, useEffect } from "react";
import { getTeacherCourses } from "../../utils/api";
import GradeEntry from "../Grades/GradeEntry";
import toast from "react-hot-toast";
import api from "../../utils/api";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchCourses();
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
                  onClick={() => setSelectedCourse(course)}
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

        {/* Grade Entry Form */}
        <div className="lg:col-span-2">
          {selectedCourse ? (
            <GradeEntry course={selectedCourse} onGradeAdded={fetchCourses} />
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
              Select a course to enter grades
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
