from django.urls import path
from . import views

urlpatterns = [
    path('', views.DepartmentListCreateView.as_view(), name='department-list'),
    path('<int:pk>/', views.DepartmentDetailView.as_view(), name='department-detail'),
]