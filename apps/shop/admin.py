from django.contrib import admin
from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['chair_name', 'shop', 'status', 'available_chairs', 'created_at']
    list_filter = ['status', 'payment_model', 'created_at']
    search_fields = ['chair_name', 'shop__email', 'description']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'

