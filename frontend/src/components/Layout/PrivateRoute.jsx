import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user"));

  console.log("PrivateRoute check:", { token: !!token, user, allowedRoles });

  if (!token) {
    console.log("No token, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log(`Role ${user?.role} not allowed. Allowed:`, allowedRoles);
    return <Navigate to="/login" />;
  }

  console.log("Access granted");
  return children;
};

export default PrivateRoute;
