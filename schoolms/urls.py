from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def api_test(request):
    """Simple API endpoint for testing frontend connection"""
    return JsonResponse({
        'message': 'Backend is working!',
        'status': 'success',
        'data': {
            'students_count': 0,
            'staff_count': 0,
            'classes_count': 0
        }
    })

def api_login(request):
    """Simple login endpoint for testing"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            # Simple validation for testing
            if email and password:
                return JsonResponse({
                    'message': 'Login successful',
                    'status': 'success',
                    'user': {
                        'email': email,
                        'role': 'student'
                    }
                })
            else:
                return JsonResponse({
                    'message': 'Invalid credentials',
                    'status': 'error'
                }, status=400)
        except json.JSONDecodeError:
            return JsonResponse({
                'message': 'Invalid JSON',
                'status': 'error'
            }, status=400)
    
    return JsonResponse({
        'message': 'Method not allowed',
        'status': 'error'
    }, status=405)

def api_dashboard(request):
    """Simple dashboard endpoint"""
    return JsonResponse({
        'message': 'Dashboard data',
        'status': 'success',
        'data': {
            'total_students': 150,
            'total_staff': 25,
            'total_classes': 12,
            'recent_activities': [
                {'type': 'login', 'user': 'student@school.com', 'time': '2024-07-29 05:47:00'},
                {'type': 'assignment_submitted', 'student': 'John Doe', 'subject': 'Math', 'time': '2024-07-29 05:30:00'}
            ]
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/test/', api_test, name='api_test'),
    path('api/login/', api_login, name='api_login'),
    path('api/dashboard/', api_dashboard, name='api_dashboard'),
    # Commented out until custom apps are properly recognized
    # path('api/auth/', include('authentication.urls')),
    # path('api/students/', include('students.urls')),
    # path('api/academics/', include('academics.urls')),
    # path('api/staff/', include('staff.urls')),
    # path('api/assessments/', include('assessments.urls')),
    # path('api/homework/', include('homework.urls')),
    # path('api/finance/', include('finance.urls')),
    # path('api/inventory/', include('inventory.urls')),
    # path('api/transport/', include('transport.urls')),
    # path('api/communications/', include('communications.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 