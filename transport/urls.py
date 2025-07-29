from django.urls import path
from . import views

app_name = 'transport'

urlpatterns = [
    # Placeholder URLs - will be implemented later
    path('', views.VehicleListView.as_view(), name='vehicle_list'),
] 