from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Course
from .serializers import CourseSerializer
from accounts.models import User

class IsTeacherOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['teacher', 'admin']
    
class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrAdmin]
    
    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)
        
class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

class TeacherCourseView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Course.objects.filter(teacher=self.request.user)

class CourseEnrollmentsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        course = Course.objects.get(pk=pk)
        enrollments = course.enrollments.all()
        from grades.serializers import EnrollmentSerializer
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)