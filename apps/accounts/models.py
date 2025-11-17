from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
import json


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, unique=True, blank=True, null=True, db_index=True)
    profile_picture = models.URLField(blank=True, null=True)
    cover_picture = models.URLField(blank=True, null=True)
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    
    is_user_verified = models.BooleanField(default=False)
    otp = models.IntegerField(blank=True, null=True)
    otp_expire_at = models.DateTimeField(blank=True, null=True)
    password_reset_token = models.CharField(max_length=255, blank=True, null=True)
    
    toggle_notification = models.BooleanField(default=True)
    is_block = models.BooleanField(default=False)
    registration_complete = models.BooleanField(default=False)
    
    # Shop details
    shop_details = models.JSONField(default=dict, blank=True)
    shop_type = models.ForeignKey('common.ShopType', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    shop_address = models.JSONField(default=dict, blank=True)
    shop_services = models.ManyToManyField('common.Service', blank=True)
    shop_amenities = models.ManyToManyField('common.Amenity', blank=True)
    shop_assets = models.JSONField(default=list, blank=True)
    certificate = models.URLField(blank=True, null=True)
    operation_hours = models.JSONField(default=dict, blank=True, null=True)
    
    # Professional details
    profession = models.CharField(max_length=255, blank=True, null=True)
    professional_phone = models.CharField(max_length=20, blank=True, null=True)
    professional_address = models.JSONField(default=dict, blank=True)
    professional_skills = models.ManyToManyField('common.ProfessionalSkill', blank=True)
    years_of_experience = models.IntegerField(blank=True, null=True)
    languages = models.JSONField(default=list, blank=True)
    portfolio_description = models.TextField(blank=True, null=True)
    portfolio_image = models.JSONField(default=list, blank=True)
    portfolio_video = models.URLField(blank=True, null=True)
    is_available = models.BooleanField(default=False)
    
    # Agent details
    agent_details = models.JSONField(default=dict, blank=True)
    profile_location = models.JSONField(default=dict, blank=True)
    
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['phone']),
            models.Index(fields=['is_block', 'registration_complete']),
        ]
    
    def get_roles(self):
        """Get user roles as list of role names"""
        return [user_role.role.name for user_role in self.user_roles.all()]
    
    def has_role(self, role_name):
        """Check if user has a specific role"""
        return self.user_roles.filter(role__name__iexact=role_name).exists()
    
    def __str__(self):
        return self.email or self.name or str(self.id)


class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    permissions = models.ManyToManyField('Permission', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'roles'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Permission(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'permissions'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class UserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_roles'
        unique_together = ['user', 'role']
    
    def __str__(self):
        return f"{self.user.email} - {self.role.name}"


class Session(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_key = models.CharField(max_length=40, unique=True)
    device_info = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    class Meta:
        db_table = 'sessions'
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['session_key']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.session_key[:8]}"


class UserDevice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='devices')
    device_id = models.CharField(max_length=255, unique=True)
    device_type = models.CharField(max_length=50, blank=True, null=True)
    fcm_token = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_devices'
        unique_together = ['user', 'device_id']
    
    def __str__(self):
        return f"{self.user.email} - {self.device_id}"

