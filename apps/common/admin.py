from django.contrib import admin
from .models import (
    ShopType, Service, ProfessionalSkill, Profession, Amenity,
    Category, FAQ, Page, EmailTemplate, Setting,
    TicketCategory, Ticket, Favorite, Plan
)


@admin.register(ShopType)
class ShopTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name']


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name']


@admin.register(ProfessionalSkill)
class ProfessionalSkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name']


@admin.register(Profession)
class ProfessionAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name']


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'is_featured', 'created_at']
    list_filter = ['status', 'is_featured', 'created_at']
    search_fields = ['name']


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['question', 'answer']


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['title', 'slug']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ['email_subject', 'email_category', 'status', 'created_at']
    list_filter = ['status', 'email_category', 'created_at']
    search_fields = ['email_subject', 'email_category']


@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    list_display = ['key', 'value']
    search_fields = ['key']


@admin.register(TicketCategory)
class TicketCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name']


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['category', 'user', 'status', 'created_at']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['user__email', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'type', 'created_at']
    list_filter = ['type', 'created_at']
    search_fields = ['user__email']


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ['title', 'duration', 'amount', 'status', 'created_at']
    list_filter = ['status', 'duration', 'created_at']
    search_fields = ['title']

