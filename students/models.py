from django.db import models
from django.contrib.auth import get_user_model
from academics.models import Class, Subject
import uuid
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image

User = get_user_model()


class Student(models.Model):
    """
    Student model with comprehensive information
    """
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('graduated', 'Graduated'),
        ('transferred', 'Transferred'),
        ('suspended', 'Suspended'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    registration_number = models.CharField(max_length=20, unique=True)
    class_enrolled = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    admission_date = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Personal Information
    date_of_birth = models.DateField()
    place_of_birth = models.CharField(max_length=100, blank=True, null=True)
    nationality = models.CharField(max_length=50, default='Zambian')
    religion = models.CharField(max_length=50, blank=True, null=True)
    
    # Contact Information
    emergency_contact_name = models.CharField(max_length=100)
    emergency_contact_phone = models.CharField(max_length=20)
    emergency_contact_relationship = models.CharField(max_length=50)
    
    # Academic Information
    previous_school = models.CharField(max_length=100, blank=True, null=True)
    academic_year = models.CharField(max_length=10)
    
    # Medical Information
    blood_group = models.CharField(max_length=5, blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    medical_conditions = models.TextField(blank=True, null=True)
    
    # Documents
    birth_certificate = models.FileField(upload_to='student_documents/birth_certificates/', blank=True, null=True)
    passport_photo = models.ImageField(upload_to='student_photos/', blank=True, null=True)
    id_card = models.ImageField(upload_to='student_id_cards/', blank=True, null=True)
    qr_code = models.ImageField(upload_to='student_qr_codes/', blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Student'
        verbose_name_plural = 'Students'
        ordering = ['registration_number']
    
    def __str__(self):
        return f"{self.user.full_name} ({self.registration_number})"
    
    def save(self, *args, **kwargs):
        if not self.registration_number:
            self.registration_number = self.generate_registration_number()
        if not self.qr_code:
            self.generate_qr_code()
        super().save(*args, **kwargs)
    
    def generate_registration_number(self):
        """Generate unique registration number"""
        year = self.admission_date.year
        count = Student.objects.filter(admission_date__year=year).count() + 1
        return f"SCH-{year}-{count:06d}"
    
    def generate_qr_code(self):
        """Generate QR code for student identification"""
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(f"Student: {self.registration_number}\nName: {self.user.full_name}")
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        
        filename = f"qr_code_{self.registration_number}.png"
        self.qr_code.save(filename, File(buffer), save=False)
    
    @property
    def current_gpa(self):
        """Calculate current GPA"""
        academics = self.academics.all()
        if not academics:
            return 0.0
        
        total_points = 0
        total_credits = 0
        
        for academic in academics:
            if academic.grade and academic.grade != 'F':
                grade_points = self.get_grade_points(academic.grade)
                total_points += grade_points * academic.subject.credits
                total_credits += academic.subject.credits
        
        return round(total_points / total_credits, 2) if total_credits > 0 else 0.0
    
    def get_grade_points(self, grade):
        """Convert letter grade to grade points"""
        grade_points = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'F': 0.0
        }
        return grade_points.get(grade, 0.0)


class StudentAcademic(models.Model):
    """
    Student academic records
    """
    GRADE_CHOICES = [
        ('A+', 'A+'), ('A', 'A'), ('A-', 'A-'),
        ('B+', 'B+'), ('B', 'B'), ('B-', 'B-'),
        ('C+', 'C+'), ('C', 'C'), ('C-', 'C-'),
        ('D+', 'D+'), ('D', 'D'), ('F', 'F'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='academics')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    term = models.CharField(max_length=20)  # e.g., "Term 1", "Term 2"
    year = models.IntegerField()
    grade = models.CharField(max_length=2, choices=GRADE_CHOICES, blank=True, null=True)
    marks = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    max_marks = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Student Academic Record'
        verbose_name_plural = 'Student Academic Records'
        unique_together = ['student', 'subject', 'term', 'year']
    
    def __str__(self):
        return f"{self.student.user.full_name} - {self.subject.name} ({self.term} {self.year})"
    
    @property
    def percentage(self):
        """Calculate percentage score"""
        if self.marks and self.max_marks:
            return round((self.marks / self.max_marks) * 100, 2)
        return 0.0


class StudentAttendance(models.Model):
    """
    Student attendance records
    """
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('excused', 'Excused'),
    ]
    
    SESSION_CHOICES = [
        ('morning', 'Morning'),
        ('afternoon', 'Afternoon'),
        ('full_day', 'Full Day'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')
    session = models.CharField(max_length=20, choices=SESSION_CHOICES, default='full_day')
    remarks = models.TextField(blank=True, null=True)
    marked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Student Attendance'
        verbose_name_plural = 'Student Attendance Records'
        unique_together = ['student', 'date', 'session']
    
    def __str__(self):
        return f"{self.student.user.full_name} - {self.date} ({self.status})"


class StudentDocument(models.Model):
    """
    Student documents management
    """
    DOCUMENT_TYPES = [
        ('birth_certificate', 'Birth Certificate'),
        ('report_card', 'Report Card'),
        ('id_card', 'ID Card'),
        ('medical_certificate', 'Medical Certificate'),
        ('transfer_certificate', 'Transfer Certificate'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('valid', 'Valid'),
        ('expired', 'Expired'),
        ('expiring_soon', 'Expiring Soon'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPES)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='student_documents/')
    description = models.TextField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='valid')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Student Document'
        verbose_name_plural = 'Student Documents'
    
    def __str__(self):
        return f"{self.student.user.full_name} - {self.title}"
    
    def save(self, *args, **kwargs):
        if self.expiry_date:
            from django.utils import timezone
            today = timezone.now().date()
            if self.expiry_date < today:
                self.status = 'expired'
            elif (self.expiry_date - today).days <= 30:
                self.status = 'expiring_soon'
            else:
                self.status = 'valid'
        super().save(*args, **kwargs)


class StudentPortfolio(models.Model):
    """
    Digital student portfolio
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='portfolio')
    bio = models.TextField(blank=True, null=True)
    achievements = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    extracurricular_activities = models.JSONField(default=list, blank=True)
    projects = models.JSONField(default=list, blank=True)
    certificates = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Student Portfolio'
        verbose_name_plural = 'Student Portfolios'
    
    def __str__(self):
        return f"Portfolio for {self.student.user.full_name}" 