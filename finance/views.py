from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import FeeStructure

class FeeStructureListView(generics.ListAPIView):
    queryset = FeeStructure.objects.all()
    permission_classes = [IsAuthenticated] 