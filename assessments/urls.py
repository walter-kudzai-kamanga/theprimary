from django.urls import path
from . import views

app_name = 'assessments'

urlpatterns = [
    # Placeholder URLs - will be implemented later
    path('', views.TestListView.as_view(), name='test_list'),
] 