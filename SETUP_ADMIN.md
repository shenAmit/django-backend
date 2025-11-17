# Admin User Setup

To create an admin user for login, run:

```bash
python create_admin.py
```

Or manually using Django shell:

```bash
python manage.py shell
```

Then in the shell:
```python
from apps.accounts.models import User
User.objects.create_superuser('admin@admin.com', 'admin123')
```

**Default Admin Credentials:**
- Email: `admin@admin.com`
- Password: `admin123`

**Important:** Make sure to run migrations first:
```bash
python manage.py migrate
```

