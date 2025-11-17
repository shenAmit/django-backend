from django.db import models
from django.core.validators import MinValueValidator


class RealEstate(models.Model):
    LISTING_TYPE_CHOICES = [
        ('agent', 'Agent'),
        ('shop', 'Shop'),
    ]
    
    ZONING_TYPE_CHOICES = [
        ('Commercial/Barber Permitted', 'Commercial/Barber Permitted'),
        ('Commercial/Salon Permitted', 'Commercial/Salon Permitted'),
        ('Commercial', 'Commercial'),
        ('Mixed-use', 'Mixed-use'),
        ('Industrial', 'Industrial'),
    ]
    
    PROPERTY_TYPE_CHOICES = [
        ('Real Estate', 'Real Estate'),
        ('Private Suite', 'Private Suite'),
    ]
    
    PRICING_MODEL_CHOICES = [
        ('For Sale', 'For Sale'),
        ('For Rent', 'For Rent'),
    ]
    
    RENT_FREQUENCY_CHOICES = [
        ('Daily', 'Daily'),
        ('Weekly', 'Weekly'),
        ('Monthly', 'Monthly'),
        ('Yearly', 'Yearly'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    # Basic Property Details
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=5000)
    property_listing_type = models.CharField(max_length=20, choices=LISTING_TYPE_CHOICES)
    
    # Address Information
    address_street = models.CharField(max_length=255, blank=True, null=True)
    address_area = models.CharField(max_length=255, blank=True, null=True)
    address_city = models.CharField(max_length=255, blank=True, null=True)
    address_state = models.CharField(max_length=255, blank=True, null=True)
    address_country = models.CharField(max_length=255, blank=True, null=True)
    address_zip_code = models.CharField(max_length=20, blank=True, null=True)
    address_latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    address_longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    
    # Property Identification
    plot_no = models.CharField(max_length=50, blank=True, null=True)
    sqft_area = models.CharField(max_length=50, blank=True, null=True)
    
    # Zoning and Property Type
    zoning_type = models.CharField(max_length=50, choices=ZONING_TYPE_CHOICES)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES)
    
    # Pricing Information
    pricing_model = models.CharField(max_length=20, choices=PRICING_MODEL_CHOICES)
    pricing_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    pricing_currency = models.CharField(max_length=3, default='USD')
    pricing_rent_frequency = models.CharField(max_length=20, choices=RENT_FREQUENCY_CHOICES, blank=True, null=True)
    
    # Rent Information
    rent_duration = models.CharField(max_length=100, blank=True, null=True)
    security_deposit = models.CharField(max_length=100, blank=True, null=True)
    rent_terms = models.JSONField(default=list, blank=True)
    
    # Listing Duration
    listing_start_date = models.DateTimeField(auto_now_add=True)
    listing_end_date = models.DateTimeField()
    listing_is_active = models.BooleanField(default=True)
    
    # Amenities
    amenities = models.ManyToManyField('common.Amenity', blank=True)
    
    # Media Files
    media_images = models.JSONField(default=list, blank=True)
    media_videos = models.JSONField(default=list, blank=True)
    media_virtual_tour = models.URLField(blank=True, null=True)
    
    # Property Owner/Agent Information
    owner = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='properties')
    
    # Property Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    views = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'real_estate'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['address_latitude', 'address_longitude', 'status', 'listing_is_active']),
            models.Index(fields=['owner', 'status', 'created_at']),
            models.Index(fields=['zoning_type', 'property_type', 'property_listing_type', 'status']),
            models.Index(fields=['pricing_model', 'pricing_amount', 'status']),
        ]
    
    def __str__(self):
        return self.title
    
    @property
    def listing_age(self):
        from django.utils import timezone
        return (timezone.now() - self.created_at).days

