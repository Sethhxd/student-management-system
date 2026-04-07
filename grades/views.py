from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Avg
from .models import Enrollment, Grade
from .serializers import EnrollmentSerializer, GradeSerializer
from courses.models import Course
from accounts.models import User
from rest_framework.exceptions import PermissionDenied

class IsTeacherOfCourse(permissions.BasePermission):
  def has_object_permission(self, request, view, obj):
    if request.user.role == 'admin':
      return True
    if request.user.role == 'teacher':
      if isinstance(obj, Grade):
        return obj.enrollment.course.teacher == request.user
      
      elif isinstance(obj, Enrollment):
        return obj.course.teacher == request.user
    return False

class EnrollmentCreateView(generics.CreateAPIView):
  queryset = Enrollment.objects.all()
  serializer_class = EnrollmentSerializer
  permission_classes = [permissions.IsAuthenticated]

  def perform_create(self, serializer):
    # check if student exists and is actually a student
    student_id = self.request.data.get('student')
    course_id = self.request.data.get('course')

    student = User.objects.get(id=student_id)
    course = Course.objects.get(id=course_id)

    if student.role != 'student':
      raise permissions.PermissionDenied("Can only enroll students")
    
    serializer.save()

class GradeCreateView(generics.CreateAPIView):
  queryset = Grade.objects.all()
  serializer_class = GradeSerializer
  permission_classes = [permissions.IsAuthenticated, IsTeacherOfCourse]

  def perform_create(self, serializer):
    enrollment_id = self.request.data.get('enrollment')
    enrollment = Enrollment.objects.get(id=enrollment_id)

    # check if current user is the teacher of this course
    if enrollment.course.teacher != self.request.user and self.request.user.role != 'admin':
      raise PermissionDenied("You can only grade your own course")
    
    serializer.save()
  
class StudentGradesView(generics.GenericAPIView):
  permission_classes = [permissions.IsAuthenticated]

  def get(self, request):
    user = request.user
    if user.role != 'student' and user.role != 'admin':
      return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)
    
    # if admin is viewing, they can specify student_id
    student_id = request.query_params.get('student_id', user.id)
    enrollments = Enrollment.objects.filter(student_id=student_id, is_active=True)
    grades = Grade.objects.filter(enrollment__in=enrollments)
    serializer = GradeSerializer(grades, many=True)

    # calculate GPA
    grade_values = [g.grade_value for g in grades if g.grade_value is not None]
    gpa = sum(grade_values) / len(grade_values) if grade_values else 0

    return Response({
      'grades': serializer.data,
      'gpa': round(gpa, 2),
      'total_courses': len(grades),
      'completed_courses': len([g for g in grades if g.grade_letter != 'F'])
    })