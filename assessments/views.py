from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Test

class TestListView(generics.ListAPIView):
    queryset = Test.objects.all()
    permission_classes = [IsAuthenticated] 