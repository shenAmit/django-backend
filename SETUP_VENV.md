# Virtual Environment Setup

## Install Dependencies in Virtual Environment

If you're using a virtual environment (venv), make sure all packages are installed:

```bash
# 1. Activate your virtual environment
# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# 2. Upgrade pip and setuptools first
python -m pip install --upgrade pip setuptools wheel

# 3. Install all requirements
pip install -r requirements.txt

# 4. Verify MongoDB packages
pip install mongoengine pymongo

# 5. Verify setuptools (needed for djangorestframework-simplejwt)
pip install setuptools
```

## Common Issues

### ModuleNotFoundError: No module named 'pkg_resources'

**Solution**: Install setuptools in your venv:
```bash
venv\Scripts\activate
pip install setuptools
```

### ModuleNotFoundError: No module named 'mongoengine'

**Solution**: Install in venv:
```bash
venv\Scripts\activate
pip install mongoengine pymongo
```

### Packages installed globally but not in venv

Make sure your virtual environment is activated before installing:
```bash
# Check if venv is active (should show venv path)
which python  # Linux/Mac
where python  # Windows

# If not active, activate it
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

## Verify Installation

```bash
# Activate venv
venv\Scripts\activate

# Check installed packages
pip list

# Verify Django
python manage.py check

# Start server
python manage.py runserver
```

