#!/usr/bin/env python
"""Script to create admin user"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'openchair.settings')
django.setup()

from apps.accounts.models import User

try:
    # Delete existing admin user if exists
    existing = User.objects.filter(email='admin@admin.com').first()
    if existing:
        existing.delete()
        print("Deleted existing admin user")

    # Create new admin user
    admin_user = User.objects.create_superuser(
        email='admin@admin.com',
        password='admin123',
        is_staff=True,
        is_superuser=True,
        is_active=True
    )

    print(f"\n✓ Admin user created successfully!")
    print(f"  Email: {admin_user.email}")
    print(f"  Is Staff: {admin_user.is_staff}")
    print(f"  Is Superuser: {admin_user.is_superuser}")
    print(f"  Is Active: {admin_user.is_active}")
    print(f"\nYou can now login with:")
    print(f"  Email: admin@admin.com")
    print(f"  Password: admin123")
    
except Exception as e:
    print(f"Error creating admin user: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

