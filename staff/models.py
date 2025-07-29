from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class Department(models.Model):
    """
    Department management
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    head = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='department_head')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Staff(models.Model):
    """
    Staff member management
    """
    EMPLOYMENT_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('temporary', 'Temporary'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('terminated', 'Terminated'),
        ('retired', 'Retired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    employee_number = models.CharField(max_length=20, unique=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    position = models.CharField(max_length=100)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default='full_time')
    hire_date = models.DateField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Personal Information
    date_of_birth = models.DateField()
    national_id = models.CharField(max_length=20, blank=True, null=True)
    emergency_contact_name = models.CharField(max_length=100)
    emergency_contact_phone = models.CharField(max_length=20)
    emergency_contact_relationship = models.CharField(max_length=50)
    
    # Bank Information
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    account_number = models.CharField(max_length=50, blank=True, null=True)
    branch_code = models.CharField(max_length=20, blank=True, null=True)
    
    # Documents
    contract_file = models.FileField(upload_to='staff_documents/contracts/', blank=True, null=True)
    id_document = models.FileField(upload_to='staff_documents/id_documents/', blank=True, null=True)
    qualifications = models.FileField(upload_to='staff_documents/qualifications/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Staff Member'
        verbose_name_plural = 'Staff Members'
        ordering = ['employee_number']
    
    def __str__(self):
        return f"{self.user.full_name} ({self.employee_number})"
    
    def save(self, *args, **kwargs):
        if not self.employee_number:
            self.employee_number = self.generate_employee_number()
        super().save(*args, **kwargs)
    
    def generate_employee_number(self):
        """Generate unique employee number"""
        year = self.hire_date.year
        count = Staff.objects.filter(hire_date__year=year).count() + 1
        return f"EMP-{year}-{count:04d}"


class StaffAttendance(models.Model):
    """
    Staff attendance tracking
    """
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('leave', 'On Leave'),
        ('sick', 'Sick Leave'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    check_in = models.TimeField(blank=True, null=True)
    check_out = models.TimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Staff Attendance'
        verbose_name_plural = 'Staff Attendance Records'
        unique_together = ['staff', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.staff.user.full_name} - {self.date} ({self.status})"
    
    @property
    def hours_worked(self):
        """Calculate hours worked"""
        if self.check_in and self.check_out:
            from datetime import datetime, timedelta
            check_in_dt = datetime.combine(self.date, self.check_in)
            check_out_dt = datetime.combine(self.date, self.check_out)
            duration = check_out_dt - check_in_dt
            return round(duration.total_seconds() / 3600, 2)
        return 0.0


class StaffLeave(models.Model):
    """
    Staff leave management
    """
    LEAVE_TYPES = [
        ('annual', 'Annual Leave'),
        ('sick', 'Sick Leave'),
        ('maternity', 'Maternity Leave'),
        ('paternity', 'Paternity Leave'),
        ('bereavement', 'Bereavement Leave'),
        ('study', 'Study Leave'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()
    days_requested = models.IntegerField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves')
    approved_at = models.DateTimeField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Staff Leave'
        verbose_name_plural = 'Staff Leave Requests'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.staff.user.full_name} - {self.leave_type} ({self.start_date} to {self.end_date})"
    
    @property
    def is_approved(self):
        return self.status == 'approved'
    
    @property
    def is_pending(self):
        return self.status == 'pending'


class Payroll(models.Model):
    """
    Payroll management
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='payroll_records')
    month = models.IntegerField()
    year = models.IntegerField()
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    overtime_pay = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=50, default='bank_transfer')
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    ], default='pending')
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Payroll'
        verbose_name_plural = 'Payroll Records'
        unique_together = ['staff', 'month', 'year']
        ordering = ['-year', '-month']
    
    def __str__(self):
        return f"{self.staff.user.full_name} - {self.month}/{self.year}"
    
    def save(self, *args, **kwargs):
        # Calculate net salary
        self.net_salary = (
            self.basic_salary + 
            self.allowances + 
            self.overtime_pay + 
            self.bonus - 
            self.deductions
        )
        super().save(*args, **kwargs)


class PerformanceReview(models.Model):
    """
    Staff performance reviews
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='performance_reviews')
    review_period_start = models.DateField()
    review_period_end = models.DateField()
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conducted_reviews')
    
    # Performance metrics
    attendance_score = models.IntegerField(help_text="Score out of 100")
    quality_score = models.IntegerField(help_text="Score out of 100")
    productivity_score = models.IntegerField(help_text="Score out of 100")
    teamwork_score = models.IntegerField(help_text="Score out of 100")
    communication_score = models.IntegerField(help_text="Score out of 100")
    
    overall_rating = models.CharField(max_length=20, choices=[
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('satisfactory', 'Satisfactory'),
        ('needs_improvement', 'Needs Improvement'),
        ('unsatisfactory', 'Unsatisfactory'),
    ])
    
    strengths = models.TextField()
    areas_for_improvement = models.TextField()
    goals_for_next_period = models.TextField()
    comments = models.TextField(blank=True, null=True)
    
    review_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Performance Review'
        verbose_name_plural = 'Performance Reviews'
        ordering = ['-review_date']
    
    def __str__(self):
        return f"{self.staff.user.full_name} - {self.review_period_start} to {self.review_period_end}"
    
    @property
    def average_score(self):
        """Calculate average performance score"""
        scores = [
            self.attendance_score,
            self.quality_score,
            self.productivity_score,
            self.teamwork_score,
            self.communication_score
        ]
        return sum(scores) / len(scores)


class StaffDocument(models.Model):
    """
    Staff document management
    """
    DOCUMENT_TYPES = [
        ('contract', 'Employment Contract'),
        ('id_document', 'ID Document'),
        ('qualifications', 'Qualifications'),
        ('certificate', 'Certificate'),
        ('reference', 'Reference Letter'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPES)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='staff_documents/')
    description = models.TextField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Staff Document'
        verbose_name_plural = 'Staff Documents'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.staff.user.full_name} - {self.title}" 