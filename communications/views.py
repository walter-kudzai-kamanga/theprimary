from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Notification

class NotificationListView(generics.ListAPIView):
    queryset = Notification.objects.all()
    permission_classes = [IsAuthenticated] 