from django.urls import path
from . import views

app_name = 'staff'

urlpatterns = [
    # Placeholder URLs - will be implemented later
    path('', views.StaffListView.as_view(), name='staff_list'),
] 