from django.urls import path
from . import views

app_name = 'homework'

urlpatterns = [
    # Placeholder URLs - will be implemented later
    path('', views.HomeworkListView.as_view(), name='homework_list'),
] 