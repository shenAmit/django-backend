from rest_framework import serializers
from .models import (
    ShopType, Service, ProfessionalSkill, Profession, Amenity,
    Category, FAQ, Page, EmailTemplate, Setting,
    TicketCategory, Ticket, Favorite, Plan
)


class ShopTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopType
        fields = ['id', 'name', 'icon', 'status', 'created_at', 'updated_at']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'status', 'created_at', 'updated_at']


class ProfessionalSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalSkill
        fields = ['id', 'name', 'status', 'created_at', 'updated_at']


class ProfessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profession
        fields = ['id', 'name', 'description', 'icon', 'status', 'created_at', 'updated_at']


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name', 'icon', 'status', 'created_at', 'updated_at']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'status', 'is_featured', 'created_at', 'updated_at']


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'status', 'created_at', 'updated_at']


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'content', 'status', 'created_at', 'updated_at']


class TicketCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketCategory
        fields = ['id', 'name', 'status', 'created_at', 'updated_at']


class TicketSerializer(serializers.ModelSerializer):
    category = TicketCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=TicketCategory.objects.filter(status=True),
        source='category',
        write_only=True
    )
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'category', 'category_id', 'description', 'status', 'user', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'job', 'professional', 'property', 'type', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

