# Admin Login Details

## Django Admin Panel

**URL**: http://localhost:8000/admin/

**Email**: `admin@example.com`

**Password**: The password was set during superuser creation. If you don't remember it:

### Reset Admin Password

```bash
python manage.py changepassword admin@example.com
```

This will prompt you to enter a new password interactively.

### Create New Admin User

If you need to create a new admin user:

```bash
python manage.py createsuperuser
```

Follow the prompts to enter:
- Email address
- Password (will be hidden)

### Set Password Programmatically

```bash
python manage.py shell
```

Then in the shell:
```python
from apps.accounts.models import User
admin = User.objects.get(email='admin@example.com')
admin.set_password('your-new-password')
admin.save()
print('Password updated!')
```

## Default Admin Credentials

- **Email**: admin@example.com
- **Password**: (Set during creation - use `changepassword` command to reset)

## Access Points

1. **Django Admin**: http://localhost:8000/admin/
   - Full CRUD for all models
   - User management
   - Role & Permission management
   - All master data (ShopTypes, Services, etc.)

2. **API Endpoints**: http://localhost:8000/api/v1/
   - REST API for all functionality

3. **Admin Dashboard**: http://localhost:8000/
   - Custom admin dashboard (when implemented)

## Admin Features Available

✅ User Management (CRUD)
✅ Role & Permission Management
✅ Shop Type Management
✅ Service Management
✅ Professional Skill Management
✅ Profession Management
✅ Amenity Management
✅ Category Management
✅ FAQ Management
✅ Page Management
✅ Email Template Management
✅ Settings Management
✅ Ticket Category Management
✅ Ticket Management
✅ Job Management
✅ Real Estate Management
✅ Favorite Management
✅ Plan Management

