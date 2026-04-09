from django.urls import path
from . import views

urlpatterns = [
    path('enroll/', views.EnrollmentCreateView.as_view(), name='enroll'),
    path('enrollments/', views.EnrollmentListView.as_view(), name='enrollment-list'),
    path('add/', views.GradeCreateView.as_view(), name='add-grade'),
    path('my-grades/', views.StudentGradesView.as_view(), name='my-grades'),
]