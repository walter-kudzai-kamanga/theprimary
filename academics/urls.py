from django.urls import path
from . import views

app_name = 'academics'

urlpatterns = [
    # Classes
    path('classes/', views.ClassListView.as_view(), name='class_list'),
    path('classes/<uuid:pk>/', views.ClassDetailView.as_view(), name='class_detail'),
    
    # Subjects
    path('subjects/', views.SubjectListView.as_view(), name='subject_list'),
    path('subjects/<uuid:pk>/', views.SubjectDetailView.as_view(), name='subject_detail'),
    
    # Lessons
    path('lessons/', views.LessonListView.as_view(), name='lesson_list'),
    path('lessons/<uuid:pk>/', views.LessonDetailView.as_view(), name='lesson_detail'),
    
    # Timetable
    path('timetable/', views.TimetableListView.as_view(), name='timetable_list'),
    path('timetable/<uuid:pk>/', views.TimetableDetailView.as_view(), name='timetable_detail'),
    
    # Assignments
    path('assignments/', views.AssignmentListView.as_view(), name='assignment_list'),
    path('assignments/<uuid:pk>/', views.AssignmentDetailView.as_view(), name='assignment_detail'),
    path('assignments/<uuid:pk>/submissions/', views.AssignmentSubmissionListView.as_view(), name='assignment_submissions'),
] 