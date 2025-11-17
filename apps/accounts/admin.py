from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Role, Permission, UserRole, Session, UserDevice


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'name', 'phone', 'is_block', 'registration_complete', 'date_joined']
    list_filter = ['is_block', 'registration_complete', 'is_staff', 'is_active', 'date_joined']
    search_fields = ['email', 'name', 'phone']
    ordering = ['-date_joined']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('name', 'phone', 'profile_picture', 'cover_picture', 'avg_rating',
                      'is_user_verified', 'is_block', 'registration_complete',
                      'toggle_notification')
        }),
        ('Shop Details', {
            'fields': ('shop_details', 'shop_type', 'shop_address', 'shop_services',
                      'shop_amenities', 'shop_assets', 'certificate', 'operation_hours')
        }),
        ('Professional Details', {
            'fields': ('profession', 'professional_phone', 'professional_address',
                      'professional_skills', 'years_of_experience', 'languages',
                      'portfolio_description', 'portfolio_image', 'portfolio_video',
                      'is_available')
        }),
        ('Agent Details', {
            'fields': ('agent_details', 'profile_location')
        }),
    )


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    filter_horizontal = ['permissions']
    search_fields = ['name']


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'created_at']
    list_filter = ['role', 'created_at']
    search_fields = ['user__email', 'role__name']


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'session_key', 'is_active', 'created_at', 'expires_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['user__email', 'session_key']
    readonly_fields = ['created_at']


@admin.register(UserDevice)
class UserDeviceAdmin(admin.ModelAdmin):
    list_display = ['user', 'device_id', 'device_type', 'is_active', 'created_at']
    list_filter = ['is_active', 'device_type', 'created_at']
    search_fields = ['user__email', 'device_id']

