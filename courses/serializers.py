from rest_framework import serializers
from .models import Course
from accounts.serializers import UserSerializer

class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.username', read_only=True)
    teacher_details = UserSerializer(source='teacher', read_only=True)
    student_count = serializers.IntegerField(source='enrollments.count', read_only=True)
    
    class Meta:
        model = Course
        fields = ('id', 'code', 'name', 'description', 'credits', 'teacher', 'teacher_name', 'teacher_details', 'student_count', 'created_at')
        read_only_fields = ('id', 'created_at')