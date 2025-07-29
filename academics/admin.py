from django.contrib import admin
from .models import Class, Subject, Lesson, Curriculum, CurriculumSubject, Timetable, Assignment, AssignmentSubmission


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'grade_level', 'teacher', 'academic_year', 'capacity', 'current_enrollment', 'enrollment_percentage', 'status')
    list_filter = ('grade_level', 'academic_year', 'status')
    search_fields = ('name', 'teacher__email', 'teacher__first_name', 'teacher__last_name')
    readonly_fields = ('enrollment_percentage',)
    ordering = ('academic_year', 'name')


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'credits', 'is_core', 'is_active')
    list_filter = ('is_core', 'is_active')
    search_fields = ('name', 'code', 'description')
    ordering = ('name',)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'class_enrolled', 'subject', 'teacher', 'date', 'start_time', 'end_time', 'status')
    list_filter = ('status', 'date', 'subject', 'class_enrolled')
    search_fields = ('title', 'class_enrolled__name', 'subject__name', 'teacher__email')
    ordering = ('-date', 'start_time')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'class_enrolled', 'subject', 'teacher')
        }),
        ('Content', {
            'fields': ('content', 'objectives', 'materials_needed')
        }),
        ('Schedule', {
            'fields': ('date', 'start_time', 'end_time', 'duration', 'room')
        }),
        ('Status', {
            'fields': ('status',)
        }),
    )


@admin.register(Curriculum)
class CurriculumAdmin(admin.ModelAdmin):
    list_display = ('name', 'academic_year', 'is_active')
    list_filter = ('academic_year', 'is_active')
    search_fields = ('name', 'description')
    ordering = ('-academic_year', 'name')


@admin.register(CurriculumSubject)
class CurriculumSubjectAdmin(admin.ModelAdmin):
    list_display = ('curriculum', 'subject', 'grade_level', 'is_required', 'order')
    list_filter = ('curriculum', 'grade_level', 'is_required')
    search_fields = ('curriculum__name', 'subject__name')
    ordering = ('curriculum', 'order')


@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('class_enrolled', 'day_of_week', 'subject', 'teacher', 'start_time', 'end_time', 'room', 'is_active')
    list_filter = ('day_of_week', 'is_active', 'subject', 'class_enrolled')
    search_fields = ('class_enrolled__name', 'subject__name', 'teacher__email')
    ordering = ('day_of_week', 'start_time')


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'due_date', 'max_marks', 'is_active', 'is_overdue')
    list_filter = ('is_active', 'due_date', 'lesson__subject')
    search_fields = ('title', 'lesson__title', 'lesson__subject__name')
    readonly_fields = ('is_overdue',)
    ordering = ('-due_date',)


@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'student', 'submitted_at', 'status', 'marks_obtained', 'percentage', 'is_late')
    list_filter = ('status', 'submitted_at', 'assignment__lesson__subject')
    search_fields = ('assignment__title', 'student__user__email', 'student__registration_number')
    readonly_fields = ('percentage', 'is_late')
    ordering = ('-submitted_at',) 