import React, { useState, useEffect } from "react";
import { addGrade, enrollStudent } from "../../utils/api";
import toast from "react-hot-toast";

const GradeEntry = ({ course, onGradeAdded }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [gradeData, setGradeData] = useState({
    grade_letter: "",
    term: new Date().getFullYear().toString(),
    remarks: "",
  });
  const [loading, setLoading] = useState(false);

  const gradeOptions = ["A", "B", "C", "D", "F"];

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, enroll the student if not already enrolled
      await enrollStudent({
        student: selectedStudent,
        course: course.id,
      });

      // Then add the grade
      await addGrade({
        enrollment: selectedStudent, // This should be enrollment ID, need to fetch properly
        grade_letter: gradeData.grade_letter,
        term: gradeData.term,
        remarks: gradeData.remarks,
      });

      toast.success("Grade added successfully!");
      setSelectedStudent("");
      setGradeData({ grade_letter: "", term: gradeData.term, remarks: "" });
      onGradeAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add grade");
    } finally {
      setLoading(false);
    }
  };

  // Mock student list - you'll need to fetch actual enrolled students
  const mockStudents = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        Enter Grades for {course.name}
      </h2>

      <form onSubmit={handleGradeSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a student</option>
            {mockStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade
          </label>
          <select
            value={gradeData.grade_letter}
            onChange={(e) =>
              setGradeData({ ...gradeData, grade_letter: e.target.value })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select grade</option>
            {gradeOptions.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Term
          </label>
          <input
            type="text"
            value={gradeData.term}
            onChange={(e) =>
              setGradeData({ ...gradeData, term: e.target.value })
            }
            required
            placeholder="e.g., Fall 2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remarks (Optional)
          </label>
          <textarea
            value={gradeData.remarks}
            onChange={(e) =>
              setGradeData({ ...gradeData, remarks: e.target.value })
            }
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Adding Grade..." : "Add Grade"}
        </button>
      </form>
    </div>
  );
};

export default GradeEntry;
