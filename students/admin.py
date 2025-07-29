from django.contrib import admin
from .models import Student, StudentAcademic, StudentAttendance, StudentDocument, StudentPortfolio


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('registration_number', 'user', 'class_enrolled', 'admission_date', 'status', 'current_gpa')
    list_filter = ('status', 'admission_date', 'class_enrolled', 'gender')
    search_fields = ('registration_number', 'user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('registration_number', 'qr_code', 'current_gpa')
    ordering = ('registration_number',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'registration_number', 'class_enrolled', 'admission_date', 'status')
        }),
        ('Personal Information', {
            'fields': ('gender', 'date_of_birth', 'place_of_birth', 'nationality', 'religion')
        }),
        ('Contact Information', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship')
        }),
        ('Academic Information', {
            'fields': ('previous_school', 'academic_year')
        }),
        ('Medical Information', {
            'fields': ('blood_group', 'allergies', 'medical_conditions')
        }),
        ('Documents', {
            'fields': ('birth_certificate', 'passport_photo', 'id_card', 'qr_code')
        }),
    )


@admin.register(StudentAcademic)
class StudentAcademicAdmin(admin.ModelAdmin):
    list_display = ('student', 'subject', 'term', 'year', 'grade', 'marks', 'percentage')
    list_filter = ('term', 'year', 'grade', 'subject')
    search_fields = ('student__user__email', 'student__registration_number', 'subject__name')
    readonly_fields = ('percentage',)
    ordering = ('-year', '-term')


@admin.register(StudentAttendance)
class StudentAttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'date', 'status', 'session', 'marked_by')
    list_filter = ('status', 'session', 'date')
    search_fields = ('student__user__email', 'student__registration_number')
    ordering = ('-date',)


@admin.register(StudentDocument)
class StudentDocumentAdmin(admin.ModelAdmin):
    list_display = ('student', 'document_type', 'title', 'status', 'uploaded_by', 'created_at')
    list_filter = ('document_type', 'status', 'created_at')
    search_fields = ('student__user__email', 'title', 'document_type')
    ordering = ('-created_at',)


@admin.register(StudentPortfolio)
class StudentPortfolioAdmin(admin.ModelAdmin):
    list_display = ('student', 'created_at', 'updated_at')
    search_fields = ('student__user__email', 'student__registration_number')
    readonly_fields = ('created_at', 'updated_at') 