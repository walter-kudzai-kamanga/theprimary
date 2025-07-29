from django.urls import path
from . import views

app_name = 'communications'

urlpatterns = [
    # Placeholder URLs - will be implemented later
    path('', views.NotificationListView.as_view(), name='notification_list'),
] 