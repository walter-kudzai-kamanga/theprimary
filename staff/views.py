from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Staff

class StaffListView(generics.ListAPIView):
    queryset = Staff.objects.all()
    permission_classes = [IsAuthenticated] 