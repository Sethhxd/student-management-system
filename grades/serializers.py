from rest_framework import serializers
from .models import Enrollment, Grade
from accounts.models import User
from courses.models import Course

class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ('id', 'student', 'student_name', 'course', 'course_name', 'course_code', 'enrolled_date', 'is_active')
        read_only_fields = ('id', 'enrolled_date')
    
class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='enrollment.student.username', read_only=True)
    student_id = serializers.CharField(source='enrollment.student.id', read_only=True)
    course_name = serializers.CharField(source='enrollment.course.name', read_only=True)
    course_code = serializers.CharField(source='enrollment.course.code', read_only=True)
    
    class Meta:
        model = Grade
        fields = ('id', 'enrollment', 'student_name', 'student_id', 'course_name', 'course_code', 'grade_letter', 'grade_value', 'term', 'remarks', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')