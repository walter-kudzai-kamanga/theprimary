from rest_framework import serializers
from authentication.serializers import UserSerializer
from academics.serializers import ClassSerializer, SubjectSerializer
from .models import Student, StudentAcademic, StudentAttendance, StudentDocument, StudentPortfolio


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class_enrolled = ClassSerializer(read_only=True)
    current_gpa = serializers.ReadOnlyField()
    
    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ('registration_number', 'qr_code', 'current_gpa')


class StudentCreateSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ('registration_number', 'qr_code', 'current_gpa')
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        student = Student.objects.create(user=user, **validated_data)
        return student


class StudentAcademicSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = StudentAcademic
        fields = '__all__'
        read_only_fields = ('percentage',)


class StudentAttendanceSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    marked_by = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentAttendance
        fields = '__all__'


class StudentDocumentSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentDocument
        fields = '__all__'


class StudentPortfolioSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    
    class Meta:
        model = StudentPortfolio
        fields = '__all__'


class StudentDashboardSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class_enrolled = ClassSerializer(read_only=True)
    current_gpa = serializers.ReadOnlyField()
    recent_academics = serializers.SerializerMethodField()
    recent_attendance = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = ('id', 'registration_number', 'user', 'class_enrolled', 'current_gpa', 
                 'recent_academics', 'recent_attendance')
    
    def get_recent_academics(self, obj):
        academics = obj.academics.all()[:5]
        return StudentAcademicSerializer(academics, many=True).data
    
    def get_recent_attendance(self, obj):
        attendance = obj.attendance_records.all()[:10]
        return StudentAttendanceSerializer(attendance, many=True).data 