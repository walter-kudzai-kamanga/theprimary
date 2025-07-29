from django.db import models
from django.contrib.auth import get_user_model
from academics.models import Class, Subject
from students.models import Student
import uuid

User = get_user_model()


class Homework(models.Model):
    """
    Homework assignments
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('archived', 'Archived'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    class_enrolled = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='homework_assignments')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_homework')
    
    # Assignment details
    due_date = models.DateTimeField()
    max_marks = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    instructions = models.TextField(blank=True, null=True)
    materials_needed = models.TextField(blank=True, null=True)
    
    # Settings
    allow_late_submission = models.BooleanField(default=False)
    late_penalty = models.DecimalField(max_digits=5, decimal_places=2, default=0, help_text="Penalty percentage for late submission")
    require_attachment = models.BooleanField(default=False)
    max_attachments = models.IntegerField(default=1)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Files
    attachment = models.FileField(upload_to='homework/attachments/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Homework'
        verbose_name_plural = 'Homework Assignments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.subject.name}"
    
    @property
    def is_overdue(self):
        """Check if homework is overdue"""
        from django.utils import timezone
        return timezone.now() > self.due_date
    
    @property
    def is_active(self):
        """Check if homework is currently active"""
        from django.utils import timezone
        now = timezone.now()
        return self.status == 'active' and now <= self.due_date


class HomeworkSubmission(models.Model):
    """
    Student homework submissions
    """
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('late', 'Late'),
        ('graded', 'Graded'),
        ('returned', 'Returned'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    homework = models.ForeignKey(Homework, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='homework_submissions')
    
    # Submission details
    content = models.TextField()
    attachment = models.FileField(upload_to='homework/submissions/', blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    # Grading
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    grade = models.CharField(max_length=2, blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    is_late = models.BooleanField(default=False)
    
    # Grading metadata
    graded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='graded_homework')
    graded_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'Homework Submission'
        verbose_name_plural = 'Homework Submissions'
        unique_together = ['homework', 'student']
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.student.user.full_name} - {self.homework.title}"
    
    def save(self, *args, **kwargs):
        # Check if submission is late
        if self.submitted_at > self.homework.due_date:
            self.is_late = True
            self.status = 'late'
        
        # Calculate percentage if marks are provided
        if self.marks_obtained and self.homework.max_marks:
            self.percentage = (self.marks_obtained / self.homework.max_marks) * 100
        
        super().save(*args, **kwargs)
    
    @property
    def is_passed(self):
        """Check if student passed the homework"""
        if self.percentage:
            return self.percentage >= 50  # Assuming 50% is passing
        return False


class HomeworkComment(models.Model):
    """
    Comments on homework submissions
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(HomeworkSubmission, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='homework_comments')
    content = models.TextField()
    is_private = models.BooleanField(default=False, help_text="Private comments only visible to teachers")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Homework Comment'
        verbose_name_plural = 'Homework Comments'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author.email} on {self.submission.homework.title}"


class HomeworkTemplate(models.Model):
    """
    Reusable homework templates
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    description = models.TextField()
    instructions = models.TextField()
    materials_needed = models.TextField(blank=True, null=True)
    estimated_duration = models.IntegerField(help_text="Estimated duration in minutes")
    difficulty_level = models.CharField(max_length=20, choices=[
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ], default='medium')
    is_public = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='homework_templates')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Homework Template'
        verbose_name_plural = 'Homework Templates'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.subject.name}"


class HomeworkAnalytics(models.Model):
    """
    Homework performance analytics
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    homework = models.OneToOneField(Homework, on_delete=models.CASCADE, related_name='analytics')
    
    # Submission statistics
    total_students = models.IntegerField(default=0)
    submitted_count = models.IntegerField(default=0)
    late_submissions = models.IntegerField(default=0)
    not_submitted = models.IntegerField(default=0)
    
    # Performance statistics
    average_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    highest_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    lowest_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    pass_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Time analysis
    average_submission_time = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Distribution data
    score_distribution = models.JSONField(default=dict, blank=True)
    
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Homework Analytics'
        verbose_name_plural = 'Homework Analytics'
    
    def __str__(self):
        return f"Analytics for {self.homework.title}"
    
    @property
    def submission_rate(self):
        """Calculate submission rate"""
        if self.total_students > 0:
            return (self.submitted_count / self.total_students) * 100
        return 0.0 