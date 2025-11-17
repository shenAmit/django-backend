from rest_framework import serializers
from .models import RealEstate


class RealEstateSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    amenities = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = RealEstate
        fields = [
            'id', 'title', 'description', 'property_listing_type',
            'address_street', 'address_area', 'address_city', 'address_state',
            'address_country', 'address_zip_code', 'address_latitude', 'address_longitude',
            'plot_no', 'sqft_area', 'zoning_type', 'property_type',
            'pricing_model', 'pricing_amount', 'pricing_currency', 'pricing_rent_frequency',
            'rent_duration', 'security_deposit', 'rent_terms',
            'listing_start_date', 'listing_end_date', 'listing_is_active',
            'amenities', 'media_images', 'media_videos', 'media_virtual_tour',
            'owner', 'status', 'views', 'created_at', 'updated_at'
        ]
        read_only_fields = ['owner', 'views', 'created_at', 'updated_at']

