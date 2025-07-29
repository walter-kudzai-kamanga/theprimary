from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Asset

class AssetListView(generics.ListAPIView):
    queryset = Asset.objects.all()
    permission_classes = [IsAuthenticated] 