from django.db import models
from django.contrib.auth import get_user_model
from students.models import Student
import uuid

User = get_user_model()


class FeeStructure(models.Model):
    """
    Fee structure management
    """
    FEE_TYPES = [
        ('tuition', 'Tuition Fee'),
        ('library', 'Library Fee'),
        ('laboratory', 'Laboratory Fee'),
        ('sports', 'Sports Fee'),
        ('transport', 'Transport Fee'),
        ('meals', 'Meals Fee'),
        ('uniform', 'Uniform Fee'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    fee_type = models.CharField(max_length=20, choices=FEE_TYPES)
    academic_year = models.CharField(max_length=10)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Fee Structure'
        verbose_name_plural = 'Fee Structures'
        unique_together = ['fee_type', 'academic_year']
    
    def __str__(self):
        return f"{self.name} - {self.academic_year}"


class StudentFee(models.Model):
    """
    Individual student fee records
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('partial', 'Partially Paid'),
        ('overdue', 'Overdue'),
        ('waived', 'Waived'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='fees')
    fee_structure = models.ForeignKey(FeeStructure, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Student Fee'
        verbose_name_plural = 'Student Fees'
        ordering = ['-due_date']
    
    def __str__(self):
        return f"{self.student.user.full_name} - {self.fee_structure.name}"
    
    def save(self, *args, **kwargs):
        self.balance = self.amount - self.amount_paid
        if self.balance <= 0:
            self.status = 'paid'
        elif self.amount_paid > 0:
            self.status = 'partial'
        super().save(*args, **kwargs)
    
    @property
    def is_overdue(self):
        """Check if fee is overdue"""
        from django.utils import timezone
        return timezone.now().date() > self.due_date and self.status != 'paid'


class Payment(models.Model):
    """
    Payment records
    """
    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer'),
        ('mobile_money', 'Mobile Money'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('check', 'Check'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='payments')
    student_fee = models.ForeignKey(StudentFee, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    reference_number = models.CharField(max_length=100, blank=True, null=True)
    payment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='processed_payments')
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        ordering = ['-payment_date']
    
    def __str__(self):
        return f"{self.student.user.full_name} - {self.amount} ({self.payment_method})"
    
    def save(self, *args, **kwargs):
        if self.status == 'completed':
            # Update student fee amount paid
            self.student_fee.amount_paid += self.amount
            self.student_fee.save()
        super().save(*args, **kwargs)


class Receipt(models.Model):
    """
    Payment receipts
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='receipt')
    receipt_number = models.CharField(max_length=50, unique=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    pdf_file = models.FileField(upload_to='receipts/', blank=True, null=True)
    
    class Meta:
        verbose_name = 'Receipt'
        verbose_name_plural = 'Receipts'
    
    def __str__(self):
        return f"Receipt {self.receipt_number} - {self.payment.student.user.full_name}"
    
    def save(self, *args, **kwargs):
        if not self.receipt_number:
            self.receipt_number = self.generate_receipt_number()
        super().save(*args, **kwargs)
    
    def generate_receipt_number(self):
        """Generate unique receipt number"""
        from datetime import datetime
        year = datetime.now().year
        count = Receipt.objects.filter(generated_at__year=year).count() + 1
        return f"RCP-{year}-{count:06d}"


class Scholarship(models.Model):
    """
    Scholarship and bursary management
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, help_text="Percentage of fee covered")
    criteria = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Scholarship'
        verbose_name_plural = 'Scholarships'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.percentage}%"


class ScholarshipApplication(models.Model):
    """
    Student scholarship applications
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('under_review', 'Under Review'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='scholarship_applications')
    scholarship = models.ForeignKey(Scholarship, on_delete=models.CASCADE, related_name='applications')
    application_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approved_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_scholarships')
    approved_at = models.DateTimeField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    supporting_documents = models.FileField(upload_to='scholarship_documents/', blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'Scholarship Application'
        verbose_name_plural = 'Scholarship Applications'
        unique_together = ['student', 'scholarship']
        ordering = ['-application_date']
    
    def __str__(self):
        return f"{self.student.user.full_name} - {self.scholarship.name}"


class FinancialReport(models.Model):
    """
    Financial reports and analytics
    """
    REPORT_TYPES = [
        ('daily', 'Daily Report'),
        ('weekly', 'Weekly Report'),
        ('monthly', 'Monthly Report'),
        ('quarterly', 'Quarterly Report'),
        ('annual', 'Annual Report'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    period_start = models.DateField()
    period_end = models.DateField()
    total_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_expenses = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    net_income = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    outstanding_fees = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    report_data = models.JSONField(default=dict, blank=True)
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Financial Report'
        verbose_name_plural = 'Financial Reports'
        ordering = ['-generated_at']
    
    def __str__(self):
        return f"{self.report_type} Report - {self.period_start} to {self.period_end}"
    
    def save(self, *args, **kwargs):
        self.net_income = self.total_revenue - self.total_expenses
        super().save(*args, **kwargs)


class Expense(models.Model):
    """
    School expenses tracking
    """
    EXPENSE_CATEGORIES = [
        ('salaries', 'Salaries'),
        ('utilities', 'Utilities'),
        ('maintenance', 'Maintenance'),
        ('supplies', 'Supplies'),
        ('equipment', 'Equipment'),
        ('transport', 'Transport'),
        ('marketing', 'Marketing'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=EXPENSE_CATEGORIES)
    expense_date = models.DateField()
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_expenses')
    receipt_file = models.FileField(upload_to='expense_receipts/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'
        ordering = ['-expense_date']
    
    def __str__(self):
        return f"{self.title} - {self.amount}"


class FeeWaiver(models.Model):
    """
    Fee waiver management
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='fee_waivers')
    student_fee = models.ForeignKey(StudentFee, on_delete=models.CASCADE, related_name='waivers')
    waiver_amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.TextField()
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_waivers')
    approved_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Fee Waiver'
        verbose_name_plural = 'Fee Waivers'
        ordering = ['-approved_at']
    
    def __str__(self):
        return f"{self.student.user.full_name} - {self.waiver_amount} waiver" 