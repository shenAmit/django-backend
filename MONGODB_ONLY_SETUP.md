# MongoDB-Only Configuration

## Current Setup

✅ **MongoDB is now used for:**
- All application data (via MongoEngine)
- Sessions (custom MongoDB session backend)
- All business logic and models

⚠️ **SQLite is only used for:**
- Django's internal migration system
- Django admin authentication tables (minimal, hidden file: `.django_internals.sqlite3`)

## Why SQLite Still Exists

Django's built-in authentication and admin system requires a SQL database. The SQLite file (`.django_internals.sqlite3`) is:
- Hidden (starts with `.`)
- Minimal (only stores Django's auth tables)
- **No application data is stored in SQLite**

## To Use MongoDB 100%

To completely remove SQLite, you would need to:
1. Convert all Django ORM models to MongoEngine Document models
2. Use a custom authentication backend that works with MongoDB
3. Replace Django admin with a custom admin interface

This is a significant refactoring. For now, MongoDB handles:
- ✅ All application data
- ✅ All sessions
- ✅ All business logic

SQLite only handles Django's internal auth system (which is required for admin login).

## MongoDB Collections

Your MongoDB database will have:
- `django_sessions` - Session data
- All your application collections (users, shops, jobs, etc. via MongoEngine)

## Session Backend

Sessions are stored in MongoDB collection `django_sessions` with:
- `session_key` - Unique session identifier
- `session_data` - Encrypted session data
- `expire_date` - Session expiration timestamp

