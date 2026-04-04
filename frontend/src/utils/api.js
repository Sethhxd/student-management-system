import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
});

// add token request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = 'Bearer ${token}';
    }
    return config;
});

// handle token refresh
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;
//         if (error.request?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             const refreshToken = localStorage.getItem('refresh_token');
//             if (refreshToken) {
//                 try {
//                     const response = await axios.post('${API_URL}/auth/token/refresh/', {
//                         refresh: refreshToken,
//                     });
//                     localStorage.setItem('access_token', request.data.access);
//                     originalRequest.headers.Authorization = 'Bearer ${respons.data.access}';
//                     return api(originalRequest);
//                 } catch (err) {
//                     // refresh failed, redirect to login
//                     localStorage.clear();
//                     window.location.href = '/login';
//                 }
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// Auth APIs
export const register = (userData) => api.post('/auth/register/', userData);
export const login = (credentials) => api.post('/auth/login/', credentials);
export const getProfile = () => api.get('/auth/profile/');

// Course APIs
export const getCourses = () => api.get('/courses/');
export const getTeacherCourses = () => api.get('/courses/teacher/');
export const createCourse = (courseData) => api.post('/courses/', courseData);

// Grade APIs
export const addGrade = (gradeData) => api.post('/grades/add/', gradeData);
export const getMyGrades = () => api.get('/grades/my-grades/');
export const enrollStudent = (enrollmentData) => api.post('/grades/enroll/', enrollmentData);

export default api;