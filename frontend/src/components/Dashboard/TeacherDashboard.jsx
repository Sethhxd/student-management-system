import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../utils/api";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    credits: 3,
    description: "",
  });
  const [gradeData, setGradeData] = useState({
    grade_letter: "A",
    term: new Date().getFullYear().toString(),
    remarks: "",
  });

  // Fetch courses
  const fetchCourses = async () => {
    try {
      console.log("Fetching courses...");
      const response = await api.get("/courses/teacher/");
      console.log("Courses:", response.data);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  // Fetch students
  const fetchStudents = async () => {
    try {
      console.log("Fetching students...");
      const response = await api.get("/auth/users/", {
        params: { role: "student" },
      });
      console.log("Students:", response.data);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Create course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post("/courses/", newCourse);
      toast.success("Course created successfully");
      setNewCourse({ code: "", name: "", credits: 3, description: "" });
      setShowCreateForm(false);
      fetchCourses();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create course");
    }
  };

  // Enroll student
  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedStudent) {
      toast.error("Select a course and student");
      return;
    }

    try {
      await api.post("/grades/enroll/", {
        student: parseInt(selectedStudent),
        course: selectedCourse.id,
      });
      toast.success("Student enrolled successfully");
      setSelectedStudent("");
      setShowEnrollForm(false);
      fetchCourses();
    } catch (error) {
      console.error("Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to enroll student");
    }
  };

  // Add grade
  const handleAddGrade = async (e) => {
    e.preventDefault();

    if (!selectedCourse || !selectedStudent) {
      toast.error("Select a student first");
      return;
    }

    try {
      let enrollmentId;

      // First, try to get existing enrollment
      console.log("Checking for existing enrollment...");
      const enrollmentsResponse = await api.get("/grades/enrollments/", {
        params: {
          student: parseInt(selectedStudent),
          course: selectedCourse.id,
        },
      });

      console.log("Enrollments response:", enrollmentsResponse.data);

      if (enrollmentsResponse.data && enrollmentsResponse.data.length > 0) {
        // Student is already enrolled
        enrollmentId = enrollmentsResponse.data[0].id;
        console.log("Found existing enrollment ID:", enrollmentId);
      } else {
        // Student not enrolled, create new enrollment
        console.log("No existing enrollment, creating one...");
        const enrollResponse = await api.post("/grades/enroll/", {
          student: parseInt(selectedStudent),
          course: selectedCourse.id,
        });
        enrollmentId = enrollResponse.data.id;
        console.log("Created new enrollment ID:", enrollmentId);
      }

      // Now add the grade
      await api.post("/grades/add/", {
        enrollment: enrollmentId,
        grade_letter: gradeData.grade_letter,
        term: gradeData.term,
        remarks: gradeData.remarks,
      });

      toast.success("Grade added successfully");
      setSelectedStudent("");
      setShowGradeForm(false);
      setGradeData({
        grade_letter: "A",
        term: new Date().getFullYear().toString(),
        remarks: "",
      });
    } catch (error) {
      console.error("Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to add grade");
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>

      {/* Debug: Show student count */}
      <div className="bg-gray-100 p-2 mb-4 rounded text-sm">
        Students available: {students.length}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course List */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Courses</h2>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                + New Course
              </button>
            </div>

            {/* Create Course Form */}
            {showCreateForm && (
              <form
                onSubmit={handleCreateCourse}
                className="mb-6 space-y-3 border-b pb-4"
              >
                <input
                  type="text"
                  placeholder="Course Code (e.g., CS101)"
                  value={newCourse.code}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, code: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Course Name"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border rounded text-sm"
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
                  className="w-full px-3 py-2 border rounded text-sm"
                />
                <textarea
                  placeholder="Description"
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-sm"
                  rows="2"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded text-sm"
                >
                  Create Course
                </button>
              </form>
            )}

            {/* Course List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowEnrollForm(false);
                    setShowGradeForm(false);
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
                No courses yet. Click "New Course" to create one.
              </p>
            )}
          </div>
        </div>

        {/* Actions Panel */}
        <div className="lg:col-span-2">
          {selectedCourse ? (
            <div className="space-y-6">
              {/* Enroll Student Form */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Enroll Student in {selectedCourse.name}
                  </h2>
                  <button
                    onClick={() => setShowEnrollForm(!showEnrollForm)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
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
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.first_name || student.username}{" "}
                          {student.last_name || ""} - {student.email}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-2 rounded"
                    >
                      Enroll in Course
                    </button>
                  </form>
                )}
              </div>

              {/* Add Grade Form */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Add Grade for {selectedCourse.name}
                  </h2>
                  <button
                    onClick={() => setShowGradeForm(!showGradeForm)}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
                  >
                    {showGradeForm ? "Cancel" : "+ Add Grade"}
                  </button>
                </div>

                {showGradeForm && (
                  <form onSubmit={handleAddGrade} className="space-y-3">
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      required
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.first_name || student.username}{" "}
                          {student.last_name || ""}
                        </option>
                      ))}
                    </select>
                    <select
                      value={gradeData.grade_letter}
                      onChange={(e) =>
                        setGradeData({
                          ...gradeData,
                          grade_letter: e.target.value,
                        })
                      }
                      required
                      className="w-full p-2 border rounded"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Term (e.g., Fall 2024)"
                      value={gradeData.term}
                      onChange={(e) =>
                        setGradeData({ ...gradeData, term: e.target.value })
                      }
                      required
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      placeholder="Remarks (optional)"
                      value={gradeData.remarks}
                      onChange={(e) =>
                        setGradeData({ ...gradeData, remarks: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                      rows="2"
                    />
                    <button
                      type="submit"
                      className="w-full bg-purple-600 text-white py-2 rounded"
                    >
                      Submit Grade
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
              Select a course to enroll students or add grades
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
