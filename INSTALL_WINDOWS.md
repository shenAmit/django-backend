# Windows Installation Guide

## Installing psycopg2-binary on Windows

If you encounter errors installing `psycopg2-binary`, try these solutions:

### Option 1: Use Pre-built Wheel (Recommended)

```bash
pip install --upgrade pip
pip install psycopg2-binary --only-binary :all:
```

### Option 2: Install PostgreSQL Client Libraries

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Install PostgreSQL (you can skip the server installation if you only need the client)
3. Add PostgreSQL `bin` directory to your PATH:
   - Usually: `C:\Program Files\PostgreSQL\15\bin`
4. Then install requirements:
   ```bash
   pip install -r requirements.txt
   ```

### Option 3: Use Alternative Database (For Development)

If you just want to test the application, you can use SQLite temporarily:

1. In `openchair/settings.py`, change the database configuration:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

2. Then install requirements without psycopg2:
```bash
pip install -r requirements.txt --ignore-installed psycopg2-binary
```

### Option 4: Use Docker (Easiest)

Docker handles all dependencies automatically:

```bash
docker-compose up --build
```

This is the recommended approach as it avoids all Windows-specific installation issues.

## Complete Installation Steps

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

2. **Upgrade pip:**
   ```bash
   python -m pip install --upgrade pip
   ```

3. **Install requirements:**
   ```bash
   pip install -r requirements.txt
   ```

   If psycopg2-binary fails, try:
   ```bash
   pip install psycopg2-binary --only-binary :all:
   pip install -r requirements.txt --ignore-installed psycopg2-binary
   ```

4. **Set up environment:**
   ```bash
   copy .env.example .env
   # Edit .env file
   ```

5. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run server:**
   ```bash
   python manage.py runserver
   ```

## Troubleshooting

### Error: "pg_config executable not found"
- Install PostgreSQL client libraries (Option 2 above)
- Or use Docker (Option 4)
- Or use SQLite for development (Option 3)

### Error: "Microsoft Visual C++ 14.0 is required"
- Install Visual C++ Build Tools: https://visualstudio.microsoft.com/visual-cpp-build-tools/
- Or use pre-built wheels: `pip install psycopg2-binary --only-binary :all:`

### Error: "Failed building wheel for psycopg2-binary"
- Try: `pip install --upgrade pip setuptools wheel`
- Then: `pip install psycopg2-binary --only-binary :all:`

