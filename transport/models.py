from django.db import models
from django.contrib.auth import get_user_model
from students.models import Student
import uuid

User = get_user_model()


class Vehicle(models.Model):
    """
    School vehicle management
    """
    VEHICLE_TYPES = [
        ('bus', 'School Bus'),
        ('van', 'Van'),
        ('car', 'Car'),
        ('truck', 'Truck'),
        ('motorcycle', 'Motorcycle'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('maintenance', 'Under Maintenance'),
        ('retired', 'Retired'),
        ('damaged', 'Damaged'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle_number = models.CharField(max_length=50, unique=True)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPES)
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    registration_number = models.CharField(max_length=50, unique=True)
    capacity = models.IntegerField(help_text="Number of passengers")
    driver = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_vehicles')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Vehicle details
    color = models.CharField(max_length=50, blank=True, null=True)
    fuel_type = models.CharField(max_length=20, choices=[
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
        ('electric', 'Electric'),
        ('hybrid', 'Hybrid'),
    ])
    insurance_expiry = models.DateField(blank=True, null=True)
    registration_expiry = models.DateField(blank=True, null=True)
    
    # Cost information
    purchase_cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    current_value = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Vehicle'
        verbose_name_plural = 'Vehicles'
        ordering = ['vehicle_number']
    
    def __str__(self):
        return f"{self.make} {self.model} ({self.registration_number})"


class Route(models.Model):
    """
    Transport routes
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    start_location = models.CharField(max_length=200)
    end_location = models.CharField(max_length=200)
    distance = models.DecimalField(max_digits=8, decimal_places=2, help_text="Distance in kilometers")
    estimated_time = models.IntegerField(help_text="Estimated time in minutes")
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True, related_name='routes')
    driver = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_routes')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Route'
        verbose_name_plural = 'Routes'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.start_location} to {self.end_location})"


class RouteStop(models.Model):
    """
    Stops along transport routes
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='stops')
    stop_name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    arrival_time = models.TimeField()
    departure_time = models.TimeField()
    order = models.IntegerField()
    
    class Meta:
        verbose_name = 'Route Stop'
        verbose_name_plural = 'Route Stops'
        ordering = ['route', 'order']
    
    def __str__(self):
        return f"{self.stop_name} - {self.route.name}"


class TransportRequest(models.Model):
    """
    Student transport requests
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='transport_requests')
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='requests')
    pickup_location = models.CharField(max_length=200)
    dropoff_location = models.CharField(max_length=200)
    pickup_time = models.TimeField()
    dropoff_time = models.TimeField()
    request_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_transport_requests')
    approved_at = models.DateTimeField(blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Transport Request'
        verbose_name_plural = 'Transport Requests'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student.user.full_name} - {self.route.name}"


class TransportSchedule(models.Model):
    """
    Daily transport schedules
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='schedules')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='schedules')
    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transport_schedules')
    date = models.DateField()
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    status = models.CharField(max_length=20, choices=[
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ], default='scheduled')
    actual_departure = models.TimeField(blank=True, null=True)
    actual_arrival = models.TimeField(blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Transport Schedule'
        verbose_name_plural = 'Transport Schedules'
        ordering = ['date', 'departure_time']
    
    def __str__(self):
        return f"{self.route.name} - {self.date} ({self.departure_time})"


class FuelRecord(models.Model):
    """
    Vehicle fuel consumption tracking
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='fuel_records')
    date = models.DateField()
    fuel_type = models.CharField(max_length=20, choices=Vehicle._meta.get_field('fuel_type').choices)
    quantity = models.DecimalField(max_digits=8, decimal_places=2, help_text="Quantity in liters")
    cost_per_liter = models.DecimalField(max_digits=6, decimal_places=2)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    odometer_reading = models.IntegerField(help_text="Odometer reading in kilometers")
    station = models.CharField(max_length=200, blank=True, null=True)
    receipt_number = models.CharField(max_length=100, blank=True, null=True)
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Fuel Record'
        verbose_name_plural = 'Fuel Records'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.vehicle.registration_number} - {self.date} ({self.quantity}L)"
    
    def save(self, *args, **kwargs):
        self.total_cost = self.quantity * self.cost_per_liter
        super().save(*args, **kwargs)


class VehicleMaintenance(models.Model):
    """
    Vehicle maintenance records
    """
    MAINTENANCE_TYPES = [
        ('scheduled', 'Scheduled Maintenance'),
        ('repair', 'Repair'),
        ('emergency', 'Emergency'),
        ('inspection', 'Inspection'),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='maintenance_records')
    maintenance_type = models.CharField(max_length=20, choices=MAINTENANCE_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    scheduled_date = models.DateField()
    completed_date = models.DateField(blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    service_provider = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    odometer_reading = models.IntegerField(blank=True, null=True)
    next_service_date = models.DateField(blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Vehicle Maintenance'
        verbose_name_plural = 'Vehicle Maintenance Records'
        ordering = ['-scheduled_date']
    
    def __str__(self):
        return f"{self.vehicle.registration_number} - {self.title}"


class Driver(models.Model):
    """
    Driver information and management
    """
    LICENSE_TYPES = [
        ('light_vehicle', 'Light Vehicle'),
        ('heavy_vehicle', 'Heavy Vehicle'),
        ('passenger', 'Passenger Vehicle'),
        ('motorcycle', 'Motorcycle'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='driver_profile')
    license_number = models.CharField(max_length=50, unique=True)
    license_type = models.CharField(max_length=20, choices=LICENSE_TYPES)
    license_expiry = models.DateField()
    experience_years = models.IntegerField(default=0)
    phone = models.CharField(max_length=20)
    emergency_contact = models.CharField(max_length=100)
    emergency_contact_phone = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Driver'
        verbose_name_plural = 'Drivers'
        ordering = ['user__first_name']
    
    def __str__(self):
        return f"{self.user.full_name} ({self.license_number})"
    
    @property
    def is_license_expired(self):
        """Check if driver license is expired"""
        from django.utils import timezone
        return timezone.now().date() > self.license_expiry 