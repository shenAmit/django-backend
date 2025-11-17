# MongoDB Setup Guide

## Configuration

The application is now configured to use MongoDB instead of PostgreSQL.

### Environment Variables

Add to your `.env` file:
```
MONGODB_URI=mongodb+srv://eoxysit2025:VPQ4a4nBD1BINP7a@cluster0.myluo3a.mongodb.net/open-chair-p?retryWrites=true&w=majority
```

### Database Structure

- **MongoDB**: Used for all application data (Users, Jobs, Properties, etc.)
- **SQLite**: Used for Django admin, sessions, and authentication (Django's built-in features)

### Using MongoDB in Your Code

#### Option 1: Using MongoEngine (Recommended)

```python
from mongoengine import Document, StringField, IntField

class User(Document):
    email = StringField(required=True, unique=True)
    name = StringField()
    # ... other fields
```

#### Option 2: Using pymongo directly

```python
from apps.common.mongodb import get_collection

users_collection = get_collection('users')
user = users_collection.find_one({'email': 'user@example.com'})
```

### Migration from Django ORM to MongoEngine

Since Django ORM doesn't work with MongoDB, you have two options:

1. **Convert models to MongoEngine** (Recommended for new projects)
2. **Use pymongo directly** (More flexible, but requires manual query writing)

### Testing Connection

```python
python manage.py shell
>>> from apps.common.mongodb import get_mongo_db
>>> db = get_mongo_db()
>>> print(db.list_collection_names())
```

### Notes

- Django admin will still work with SQLite for admin users
- All application data (Users, Jobs, Properties) will be stored in MongoDB
- Sessions and authentication tokens can be stored in MongoDB if needed (requires additional setup)

