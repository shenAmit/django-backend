from django.db import models
from django.core.validators import MinValueValidator


class Job(models.Model):
    PAYMENT_MODEL_CHOICES = [
        ('Fixed Pay', 'Fixed Pay'),
        ('Commission Pay', 'Commission Pay'),
    ]
    
    UNIT_CHOICES = [
        ('Hourly', 'Hourly'),
        ('Percentage', 'Percentage'),
        ('Weekly', 'Weekly'),
        ('Monthly', 'Monthly'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    ]
    
    shop = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='jobs')
    chair_name = models.CharField(max_length=255)
    available_chairs = models.IntegerField(validators=[MinValueValidator(1)], default=1)
    
    # Payment details
    payment_model = models.CharField(max_length=20, choices=PAYMENT_MODEL_CHOICES)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    payment_unit = models.CharField(max_length=20, choices=UNIT_CHOICES)
    
    # Availability
    availability_start_date = models.DateTimeField()
    availability_end_date = models.DateTimeField()
    
    description = models.TextField()
    amenities = models.JSONField(default=list, blank=True)
    cover_images = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'jobs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['shop', 'status', 'availability_end_date']),
            models.Index(fields=['status', 'availability_end_date', 'created_at']),
            models.Index(fields=['created_at']),
            models.Index(fields=['shop', 'status', 'availability_end_date', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.chair_name} - {self.shop.email}"

