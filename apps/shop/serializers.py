from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    shop = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Job
        fields = [
            'id', 'shop', 'chair_name', 'available_chairs',
            'payment_model', 'payment_amount', 'payment_unit',
            'availability_start_date', 'availability_end_date',
            'description', 'amenities', 'cover_images', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['shop', 'created_at', 'updated_at']

