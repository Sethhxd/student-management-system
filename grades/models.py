from django.db import models
from accounts.models import User
from courses.models import Course

class Enrollment(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'},
        related_name='enrollments'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    enrolled_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['student', 'course']
        
    def __str__(self):
        return f"{self.student.username} - {self.course.code}"
    
class Grade(models.Model):
    GRADE_CHOICES = (
        ('A', 'A (90-100)'),
        ('B', 'B (80-89)'),
        ('C', 'C (70-79)'),
        ('D', 'D (60-69)'),
        ('F', 'F (Below 60)'),
    )
    
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='grades')
    grade_letter = models.CharField(max_length=1, choices=GRADE_CHOICES)
    grade_value = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    term = models.CharField(max_length=20)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        # convert letter grade to numeric value
        grade_mapping = {'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0}
        if self.grade_letter in grade_mapping:
            self.grade_value = grade_mapping[self.grade_letter]
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.enrollment.student.username} - {self.enrollment.course.code}: {self.grade_letter}"