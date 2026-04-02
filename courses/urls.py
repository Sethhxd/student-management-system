from django.urls import path
from . import views

urlpatterns = [
    path('', views.CourseListCreateView.as_view(), name='course-list'),
    path('<int:pk>/', views.CourseDetailView.as_view(), name='course-detail'),
    path('teacher/', views.TeacherCourseView.as_view(), name='teacher-courses'),
    path('<int:pk>/enrollments/', views.CourseEnrollmentsView.as_view(), name='course-enrollments'),
]