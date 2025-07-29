from django.urls import path
from . import views

app_name = 'students'

urlpatterns = [
    path('', views.StudentListView.as_view(), name='student_list'),
    path('<uuid:pk>/', views.StudentDetailView.as_view(), name='student_detail'),
    path('create/', views.StudentCreateView.as_view(), name='student_create'),
    path('<uuid:pk>/academics/', views.StudentAcademicListView.as_view(), name='student_academics'),
    path('<uuid:pk>/attendance/', views.StudentAttendanceListView.as_view(), name='student_attendance'),
    path('<uuid:pk>/documents/', views.StudentDocumentListView.as_view(), name='student_documents'),
    path('<uuid:pk>/portfolio/', views.StudentPortfolioView.as_view(), name='student_portfolio'),
    path('dashboard/<uuid:pk>/', views.StudentDashboardView.as_view(), name='student_dashboard'),
] 