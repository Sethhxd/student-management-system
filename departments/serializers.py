from rest_framework import serializers
from .models import Department

class DepartmentSerializer(serializers.ModelSerializer):
    user_count = serializers.IntegerField(source='user.count', read_only=True)
    
    class Meta:
        model = Department
        fields = '__all__'