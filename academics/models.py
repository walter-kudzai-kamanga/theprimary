from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class Class(models.Model):
    """
    Class/Grade management
    """
    GRADE_LEVELS = [
        ('grade_1', 'Grade 1'),
        ('grade_2', 'Grade 2'),
        ('grade_3', 'Grade 3'),
        ('grade_4', 'Grade 4'),
        ('grade_5', 'Grade 5'),
        ('grade_6', 'Grade 6'),
        ('grade_7', 'Grade 7'),
        ('grade_8', 'Grade 8'),
        ('grade_9', 'Grade 9'),
        ('grade_10', 'Grade 10'),
        ('grade_11', 'Grade 11'),
        ('grade_12', 'Grade 12'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('completed', 'Completed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)  # e.g., "Class 1A", "Grade 1"
    grade_level = models.CharField(max_length=20, choices=GRADE_LEVELS)
    teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='classes_taught')
    academic_year = models.CharField(max_length=10)  # e.g., "2024-2025"
    capacity = models.IntegerField(default=30)
    current_enrollment = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Class'
        verbose_name_plural = 'Classes'
        unique_together = ['name', 'academic_year']
    
    def __str__(self):
        return f"{self.name} ({self.academic_year})"
    
    @property
    def enrollment_percentage(self):
        """Calculate enrollment percentage"""
        if self.capacity > 0:
            return round((self.current_enrollment / self.capacity) * 100, 2)
        return 0.0


class Subject(models.Model):
    """
    Subject/Course management
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    credits = models.IntegerField(default=1)
    is_core = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Subject'
        verbose_name_plural = 'Subjects'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class Lesson(models.Model):
    """
    Lesson planning and scheduling
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    class_enrolled = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='lessons')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lessons_taught')
    title = models.CharField(max_length=200)
    content = models.TextField()
    objectives = models.TextField(blank=True, null=True)
    materials_needed = models.TextField(blank=True, null=True)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration = models.IntegerField(help_text="Duration in minutes")
    room = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=20, choices=[
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ], default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Lesson'
        verbose_name_plural = 'Lessons'
        ordering = ['date', 'start_time']
    
    def __str__(self):
        return f"{self.title} - {self.class_enrolled.name} ({self.date})"
    
    @property
    def is_today(self):
        """Check if lesson is scheduled for today"""
        from django.utils import timezone
        return self.date == timezone.now().date()
    
    @property
    def is_overdue(self):
        """Check if lesson is overdue"""
        from django.utils import timezone
        return self.date < timezone.now().date() and self.status == 'scheduled'


class Curriculum(models.Model):
    """
    Curriculum management
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    academic_year = models.CharField(max_length=10)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Curriculum'
        verbose_name_plural = 'Curricula'
    
    def __str__(self):
        return f"{self.name} ({self.academic_year})"


class CurriculumSubject(models.Model):
    """
    Subjects in curriculum
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    curriculum = models.ForeignKey(Curriculum, on_delete=models.CASCADE, related_name='subjects')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    grade_level = models.CharField(max_length=20, choices=Class.GRADE_LEVELS)
    is_required = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Curriculum Subject'
        verbose_name_plural = 'Curriculum Subjects'
        unique_together = ['curriculum', 'subject', 'grade_level']
        ordering = ['order']
    
    def __str__(self):
        return f"{self.subject.name} - {self.grade_level}"


class Timetable(models.Model):
    """
    Class timetable management
    """
    DAYS_OF_WEEK = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    class_enrolled = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='timetables')
    day_of_week = models.CharField(max_length=20, choices=DAYS_OF_WEEK)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='timetable_slots')
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Timetable'
        verbose_name_plural = 'Timetables'
        unique_together = ['class_enrolled', 'day_of_week', 'start_time']
        ordering = ['day_of_week', 'start_time']
    
    def __str__(self):
        return f"{self.class_enrolled.name} - {self.subject.name} ({self.day_of_week})"


class Assignment(models.Model):
    """
    Assignment management
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateTimeField()
    max_marks = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignments_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Assignment'
        verbose_name_plural = 'Assignments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.lesson.subject.name}"
    
    @property
    def is_overdue(self):
        """Check if assignment is overdue"""
        from django.utils import timezone
        return timezone.now() > self.due_date


class AssignmentSubmission(models.Model):
    """
    Student assignment submissions
    """
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('graded', 'Graded'),
        ('late', 'Late'),
        ('missing', 'Missing'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='assignment_submissions')
    content = models.TextField()
    file_attachment = models.FileField(upload_to='assignment_submissions/', blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    graded_at = models.DateTimeField(blank=True, null=True)
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    graded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='graded_submissions')
    
    class Meta:
        verbose_name = 'Assignment Submission'
        verbose_name_plural = 'Assignment Submissions'
        unique_together = ['assignment', 'student']
    
    def __str__(self):
        return f"{self.student.user.full_name} - {self.assignment.title}"
    
    @property
    def percentage(self):
        """Calculate percentage score"""
        if self.marks_obtained and self.assignment.max_marks:
            return round((self.marks_obtained / self.assignment.max_marks) * 100, 2)
        return 0.0
    
    @property
    def is_late(self):
        """Check if submission is late"""
        return self.submitted_at > self.assignment.due_date 