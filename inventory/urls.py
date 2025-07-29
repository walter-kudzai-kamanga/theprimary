from django.urls import path
from . import views

app_name = 'inventory'

urlpatterns = [
    # Placeholder URLs - will be implemented later
    path('', views.AssetListView.as_view(), name='asset_list'),
] 