import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

// add token request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  console.log("Interceptor - Token found: ", !!token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Interceptor - Added authorization header");
  } else {
    console.log("Interceptor - no token found");
  }
  return config;
});

// Auth APIs
export const register = (userData) => api.post("/auth/register/", userData);
export const login = (credentials) => api.post("/auth/login/", credentials);
export const getProfile = () => api.get("/auth/profile/");

// Course APIs
export const getCourses = () => api.get("/courses/");
export const getTeacherCourses = () => api.get("/courses/teacher/");
export const createCourse = (courseData) => api.post("/courses/", courseData);
export const deleteCourse = (id) => api.delete(`/courses/${id}/`);

// Grade APIs
export const addGrade = (gradeData) => api.post("/grades/add/", gradeData);
export const getMyGrades = () => api.get("/grades/my-grades/");
export const enrollStudent = (enrollmentData) =>
  api.post("/grades/enroll/", enrollmentData);

// Users APIs
export const getUsers = () => api.get("./auth/users/");
export const deleteUser = (id) => api.delete(`/auth/users/${id}/`);

// Student's enrolled courses
export const getMyCourses = () => api.get("/grades/my-courses/");

export default api;
