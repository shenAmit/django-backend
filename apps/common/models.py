from django.db import models
from django.utils.text import slugify


class ShopType(models.Model):
    name = models.CharField(max_length=255)
    icon = models.URLField(blank=True, null=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'shop_types'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Service(models.Model):
    name = models.CharField(max_length=255, unique=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'services'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class ProfessionalSkill(models.Model):
    name = models.CharField(max_length=255, unique=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'professional_skills'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Profession(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    icon = models.URLField(blank=True, null=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'professions'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Amenity(models.Model):
    name = models.CharField(max_length=255)
    icon = models.URLField(blank=True, null=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'amenities'
        ordering = ['name']
        verbose_name_plural = 'Amenities'
    
    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    image = models.URLField(blank=True, null=True)
    status = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'categories'
        ordering = ['name']
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return self.name


class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'faqs'
        ordering = ['-created_at']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'
    
    def __str__(self):
        return self.question[:50]


class Page(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    content = models.TextField()
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pages'
        ordering = ['title']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title


class EmailTemplate(models.Model):
    from_name = models.CharField(max_length=255, blank=True, null=True)
    from_email = models.EmailField(blank=True, null=True)
    email_category = models.CharField(max_length=255, blank=True, null=True)
    email_subject = models.CharField(max_length=255, blank=True, null=True)
    email_content = models.TextField(blank=True, null=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'email_templates'
        ordering = ['email_category']
    
    def __str__(self):
        return self.email_subject or self.email_category or str(self.id)


class Setting(models.Model):
    key = models.CharField(max_length=255, unique=True)
    value = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'settings'
        ordering = ['key']
    
    def __str__(self):
        return self.key


class TicketCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ticket_categories'
        ordering = ['name']
        verbose_name_plural = 'Ticket Categories'
    
    def __str__(self):
        return self.name


class Ticket(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]
    
    category = models.ForeignKey(TicketCategory, on_delete=models.CASCADE, related_name='tickets')
    description = models.TextField(max_length=1000)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='tickets', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tickets'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.category.name} - {self.user.email}"


class Favorite(models.Model):
    TYPE_CHOICES = [
        ('chair', 'Chair'),
        ('suit', 'Suit'),
        ('realestate', 'Real Estate'),
        ('professional', 'Professional'),
    ]
    
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='favorites', null=True, blank=True)
    job = models.ForeignKey('shop.Job', on_delete=models.CASCADE, null=True, blank=True, related_name='favorites')
    professional = models.ForeignKey('accounts.User', on_delete=models.CASCADE, null=True, blank=True, related_name='favorited_by')
    property = models.ForeignKey('realestate.RealEstate', on_delete=models.CASCADE, null=True, blank=True, related_name='favorites')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='chair')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'favorites'
        unique_together = [
            ['user', 'job', 'type'],
            ['user', 'property', 'type'],
            ['user', 'professional', 'type'],
        ]
        indexes = [
            models.Index(fields=['user', 'type']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.type}"


class Plan(models.Model):
    DURATION_CHOICES = [
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
        ('free', 'Free'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    INTERVAL_CHOICES = [
        ('month', 'Month'),
        ('year', 'Year'),
    ]
    
    title = models.CharField(max_length=255)
    duration = models.CharField(max_length=20, choices=DURATION_CHOICES)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=35)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    stripe_price_id = models.CharField(max_length=255, unique=True, blank=True, null=True)
    stripe_product_id = models.CharField(max_length=255, blank=True, null=True)
    interval = models.CharField(max_length=20, choices=INTERVAL_CHOICES, blank=True, null=True)
    interval_count = models.IntegerField(default=1)
    validity_period = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'plans'
        ordering = ['amount']
    
    def __str__(self):
        return self.title

