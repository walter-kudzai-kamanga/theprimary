from django.urls import path
from . import views

app_name = 'finance'

urlpatterns = [
    # Placeholder URLs - will be implemented later
    path('', views.FeeStructureListView.as_view(), name='fee_structure_list'),
] 