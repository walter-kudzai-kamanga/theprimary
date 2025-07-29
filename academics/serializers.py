from rest_framework import serializers
from authentication.serializers import UserSerializer
from .models import Class, Subject, Lesson, Curriculum, CurriculumSubject, Timetable, Assignment, AssignmentSubmission


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'


class ClassSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    enrollment_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Class
        fields = '__all__'
        read_only_fields = ('enrollment_percentage',)


class LessonSerializer(serializers.ModelSerializer):
    class_enrolled = ClassSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    teacher = UserSerializer(read_only=True)
    is_today = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = Lesson
        fields = '__all__'
        read_only_fields = ('is_today', 'is_overdue')


class CurriculumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curriculum
        fields = '__all__'


class CurriculumSubjectSerializer(serializers.ModelSerializer):
    curriculum = CurriculumSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    
    class Meta:
        model = CurriculumSubject
        fields = '__all__'


class TimetableSerializer(serializers.ModelSerializer):
    class_enrolled = ClassSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    teacher = UserSerializer(read_only=True)
    
    class Meta:
        model = Timetable
        fields = '__all__'


class AssignmentSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = Assignment
        fields = '__all__'
        read_only_fields = ('is_overdue',)


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    assignment = AssignmentSerializer(read_only=True)
    student = serializers.PrimaryKeyRelatedField(read_only=True)
    graded_by = UserSerializer(read_only=True)
    percentage = serializers.ReadOnlyField()
    is_late = serializers.ReadOnlyField()
    
    class Meta:
        model = AssignmentSubmission
        fields = '__all__'
        read_only_fields = ('percentage', 'is_late') 