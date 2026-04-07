import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import TeacherDashboard from "./components/Dashboard/TeacherDashboard";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import PrivateRoute from "./components/Layout/PrivateRoute";
import Navbar from "./components/Layout/Navbar";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Toaster position="top-right" />
      {localStorage.getItem("access_token") && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/teacher/dashboard"
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={
            <Navigate
              to={
                user?.role === "teacher"
                  ? "/teacher/dashboard"
                  : user?.role === "student"
                    ? "/student/dashboard"
                    : user?.role === "admin"
                      ? "/admin/dashboard"
                      : "/login"
              }
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
