from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Vehicle

class VehicleListView(generics.ListAPIView):
    queryset = Vehicle.objects.all()
    permission_classes = [IsAuthenticated] 