from django.db import models
from django.contrib.auth import get_user_model
from academics.models import Class, Subject
import uuid

User = get_user_model()


class Test(models.Model):
    """
    Test/Exam management
    """
    TEST_TYPES = [
        ('quiz', 'Quiz'),
        ('test', 'Test'),
        ('exam', 'Exam'),
        ('assignment', 'Assignment'),
        ('project', 'Project'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    class_enrolled = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='tests')
    test_type = models.CharField(max_length=20, choices=TEST_TYPES)
    description = models.TextField(blank=True, null=True)
    instructions = models.TextField(blank=True, null=True)
    
    # Timing
    duration = models.IntegerField(help_text="Duration in minutes")
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    # Scoring
    total_marks = models.DecimalField(max_digits=5, decimal_places=2)
    passing_marks = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Settings
    allow_retakes = models.BooleanField(default=False)
    shuffle_questions = models.BooleanField(default=False)
    show_results_immediately = models.BooleanField(default=False)
    require_proctoring = models.BooleanField(default=False)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tests')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Test'
        verbose_name_plural = 'Tests'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.subject.name}"
    
    @property
    def is_active(self):
        """Check if test is currently active"""
        from django.utils import timezone
        now = timezone.now()
        return self.start_date <= now <= self.end_date and self.status == 'active'
    
    @property
    def is_overdue(self):
        """Check if test is overdue"""
        from django.utils import timezone
        return timezone.now() > self.end_date


class Question(models.Model):
    """
    Test questions
    """
    QUESTION_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('true_false', 'True/False'),
        ('short_answer', 'Short Answer'),
        ('essay', 'Essay'),
        ('matching', 'Matching'),
        ('fill_blank', 'Fill in the Blank'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    marks = models.DecimalField(max_digits=5, decimal_places=2, default=1.0)
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='medium')
    
    # For multiple choice questions
    options = models.JSONField(default=list, blank=True)
    correct_answer = models.TextField(blank=True, null=True)
    
    # For essay questions
    word_limit = models.IntegerField(blank=True, null=True)
    
    # Metadata
    explanation = models.TextField(blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Question'
        verbose_name_plural = 'Questions'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.question_text[:50]}..."


class QuestionBank(models.Model):
    """
    Reusable question bank
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='question_banks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    difficulty_level = models.CharField(max_length=20, choices=Question.DIFFICULTY_LEVELS, default='medium')
    tags = models.JSONField(default=list, blank=True)
    is_public = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='question_banks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Question Bank'
        verbose_name_plural = 'Question Banks'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.subject.name}"


class QuestionBankItem(models.Model):
    """
    Questions in question bank
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question_bank = models.ForeignKey(QuestionBank, on_delete=models.CASCADE, related_name='items')
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=Question.QUESTION_TYPES)
    options = models.JSONField(default=list, blank=True)
    correct_answer = models.TextField(blank=True, null=True)
    explanation = models.TextField(blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Question Bank Item'
        verbose_name_plural = 'Question Bank Items'
    
    def __str__(self):
        return f"{self.question_text[:50]}..."


class TestSubmission(models.Model):
    """
    Student test submissions
    """
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('submitted', 'Submitted'),
        ('graded', 'Graded'),
        ('late', 'Late'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='test_submissions')
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    # Scoring
    score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    grade = models.CharField(max_length=2, blank=True, null=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    is_late = models.BooleanField(default=False)
    
    # Feedback
    feedback = models.TextField(blank=True, null=True)
    graded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='graded_tests')
    graded_at = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Test Submission'
        verbose_name_plural = 'Test Submissions'
        unique_together = ['test', 'student']
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.student.user.full_name} - {self.test.title}"
    
    @property
    def is_passed(self):
        """Check if student passed the test"""
        if self.percentage and self.test.passing_marks:
            return self.percentage >= (self.test.passing_marks / self.test.total_marks * 100)
        return False


class TestAnswer(models.Model):
    """
    Individual question answers in test submissions
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(TestSubmission, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_text = models.TextField(blank=True, null=True)
    selected_options = models.JSONField(default=list, blank=True)
    is_correct = models.BooleanField(blank=True, null=True)
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Test Answer'
        verbose_name_plural = 'Test Answers'
        unique_together = ['submission', 'question']
    
    def __str__(self):
        return f"{self.submission.student.user.full_name} - {self.question.question_text[:30]}..."


class TestResult(models.Model):
    """
    Detailed test results and analytics
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='results')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='test_results')
    submission = models.OneToOneField(TestSubmission, on_delete=models.CASCADE, related_name='result')
    
    # Performance metrics
    total_questions = models.IntegerField()
    correct_answers = models.IntegerField()
    incorrect_answers = models.IntegerField()
    unanswered_questions = models.IntegerField()
    
    # Time analysis
    time_taken = models.IntegerField(help_text="Time taken in minutes")
    average_time_per_question = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    
    # Subject-wise breakdown
    subject_performance = models.JSONField(default=dict, blank=True)
    
    # Analytics
    percentile = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rank = models.IntegerField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Test Result'
        verbose_name_plural = 'Test Results'
        unique_together = ['test', 'student']
    
    def __str__(self):
        return f"{self.student.user.full_name} - {self.test.title} Result"


class PlagiarismCheck(models.Model):
    """
    Plagiarism detection for test submissions
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(TestSubmission, on_delete=models.CASCADE, related_name='plagiarism_checks')
    answer = models.ForeignKey(TestAnswer, on_delete=models.CASCADE, related_name='plagiarism_checks')
    
    similarity_score = models.DecimalField(max_digits=5, decimal_places=2, help_text="Similarity percentage")
    matched_sources = models.JSONField(default=list, blank=True)
    is_plagiarized = models.BooleanField(default=False)
    flagged_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    flagged_at = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'Plagiarism Check'
        verbose_name_plural = 'Plagiarism Checks'
    
    def __str__(self):
        return f"Plagiarism check for {self.submission.student.user.full_name}"


class TestAnalytics(models.Model):
    """
    Test performance analytics
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='analytics')
    
    # Overall statistics
    total_submissions = models.IntegerField(default=0)
    completed_submissions = models.IntegerField(default=0)
    average_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    highest_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    lowest_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    pass_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Question analysis
    question_analytics = models.JSONField(default=dict, blank=True)
    
    # Time analysis
    average_completion_time = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Distribution data
    score_distribution = models.JSONField(default=dict, blank=True)
    
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Test Analytics'
        verbose_name_plural = 'Test Analytics'
    
    def __str__(self):
        return f"Analytics for {self.test.title}" 