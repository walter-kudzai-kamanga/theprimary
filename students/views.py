from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Student, StudentAcademic, StudentAttendance, StudentDocument, StudentPortfolio
from .serializers import (
    StudentSerializer, StudentCreateSerializer, StudentAcademicSerializer,
    StudentAttendanceSerializer, StudentDocumentSerializer, StudentPortfolioSerializer,
    StudentDashboardSerializer
)


class StudentListView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]


class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]


class StudentCreateView(generics.CreateAPIView):
    serializer_class = StudentCreateSerializer
    permission_classes = [IsAuthenticated]


class StudentAcademicListView(generics.ListCreateAPIView):
    serializer_class = StudentAcademicSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return StudentAcademic.objects.filter(student_id=self.kwargs['pk'])


class StudentAttendanceListView(generics.ListCreateAPIView):
    serializer_class = StudentAttendanceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return StudentAttendance.objects.filter(student_id=self.kwargs['pk'])


class StudentDocumentListView(generics.ListCreateAPIView):
    serializer_class = StudentDocumentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return StudentDocument.objects.filter(student_id=self.kwargs['pk'])


class StudentPortfolioView(generics.RetrieveUpdateAPIView):
    serializer_class = StudentPortfolioSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return StudentPortfolio.objects.get_or_create(student_id=self.kwargs['pk'])[0]


class StudentDashboardView(generics.RetrieveAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentDashboardSerializer
    permission_classes = [IsAuthenticated] 