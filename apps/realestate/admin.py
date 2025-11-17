from django.contrib import admin
from .models import RealEstate


@admin.register(RealEstate)
class RealEstateAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'property_type', 'pricing_model', 'status', 'views', 'created_at']
    list_filter = ['property_type', 'pricing_model', 'status', 'zoning_type', 'created_at']
    search_fields = ['title', 'description', 'owner__email']
    readonly_fields = ['views', 'created_at', 'updated_at']
    filter_horizontal = ['amenities']
    date_hierarchy = 'created_at'

