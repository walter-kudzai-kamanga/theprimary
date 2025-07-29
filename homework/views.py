from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Homework

class HomeworkListView(generics.ListAPIView):
    queryset = Homework.objects.all()
    permission_classes = [IsAuthenticated] 