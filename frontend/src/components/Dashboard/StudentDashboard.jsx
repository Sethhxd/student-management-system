import React, { useState, useEffect } from "react";
import { getMyGrades } from "../../utils/api";
import GradeView from "../Grades/GradeView";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(0);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await getMyGrades();
      setGrades(response.data.grades);
      setGpa(response.data.gpa);
      setStats({
        totalCourses: response.data.total_courses,
        completedCourses: response.data.completed_courses,
      });
    } catch (error) {
      toast.error("Failed to fetch grades");
    } finally {
      setLoading(false);
    }
  };

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
        Student Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Current GPA</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{gpa}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Courses</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.totalCourses}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">
            Completed Courses
          </h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {stats.completedCourses}
          </p>
        </div>
      </div>

      {/* Grades Table */}
      <GradeView grades={grades} />
    </div>
  );
};

export default StudentDashboard;
