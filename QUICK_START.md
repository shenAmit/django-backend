# Quick Start Guide

## Install Dependencies in Virtual Environment

If you're using a virtual environment, make sure to install all packages:

```bash
# Activate venv (Windows)
venv\Scripts\activate

# Install all dependencies
pip install -r requirements.txt

# Or install MongoDB packages separately
pip install mongoengine pymongo
```

## Start the Server

```bash
# Make sure venv is activated
venv\Scripts\activate

# Run migrations (if not done)
python manage.py migrate

# Start server
python manage.py runserver
```

## Access Points

- **Django Admin**: http://localhost:8000/admin/
- **API Base**: http://localhost:8000/api/v1/
- **Admin Panel**: http://localhost:8000/

## MongoDB Connection

The app will connect to MongoDB automatically when mongoengine is installed. If you see a warning about mongoengine not being installed, run:

```bash
pip install mongoengine pymongo
```

## Troubleshooting

### ModuleNotFoundError: No module named 'mongoengine'

**Solution**: Install in your virtual environment:
```bash
# Activate venv first
venv\Scripts\activate

# Then install
pip install mongoengine pymongo
```

### MongoDB Connection Issues

Check your `.env` file has the correct `MONGODB_URI`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/open-chair-p?retryWrites=true&w=majority
```

