"""
Custom MongoDB session backend for Django
Stores sessions in MongoDB instead of SQLite
"""
from django.contrib.sessions.backends.base import SessionBase, CreateError
from django.core.exceptions import SuspiciousOperation
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
import json
import pymongo


# Django will look for a class named 'SessionStore' in this module
class SessionStore(SessionBase):
    """
    MongoDB session store backend
    """
    def __init__(self, session_key=None):
        super().__init__(session_key)
        self._collection = None  # Will be initialized lazily
    
    @staticmethod
    def _get_collection():
        """Get MongoDB sessions collection"""
        try:
            # Get MongoDB settings from Django settings
            mongodb_uri = getattr(settings, 'MONGODB_URI', 'mongodb://localhost:27017/open-chair')
            mongodb_name = getattr(settings, 'MONGODB_NAME', 'open-chair')
            
            # Parse database name from URI if provided
            if '/' in mongodb_uri:
                db_name = mongodb_uri.split('/')[-1].split('?')[0]
                if db_name:
                    mongodb_name = db_name
            
            client = pymongo.MongoClient(mongodb_uri)
            db = client[mongodb_name]
            return db['django_sessions']
        except Exception as e:
            raise Exception(f"Failed to connect to MongoDB for sessions: {e}")
    
    def load(self):
        """Load session data from MongoDB"""
        if not self.session_key:
            return {}
        
        try:
            collection = self._get_collection()
            session_data = collection.find_one({
                'session_key': self.session_key,
                'expire_date': {'$gt': timezone.now()}
            })
            
            if session_data:
                return self.decode(session_data.get('session_data', ''))
        except Exception:
            pass
        return {}
    
    def exists(self, session_key):
        """Check if session exists"""
        try:
            collection = self._get_collection()
            return collection.find_one({
                'session_key': session_key,
                'expire_date': {'$gt': timezone.now()}
            }) is not None
        except Exception:
            return False
    
    def create(self):
        """Create a new session"""
        while True:
            # Generate a new session key
            session_key = self._get_new_session_key()
            # Use the _session_key property setter (which validates and sets __session_key)
            self._session_key = session_key
            try:
                self.save(must_create=True)
            except CreateError:
                # If session key already exists, try again with a new key
                continue
            self.modified = True
            self._session_cache = {}
            return
    
    def save(self, must_create=False):
        """Save session to MongoDB"""
        if self.session_key is None:
            return self.create()
        
        session_data = self._get_session(no_load=must_create)
        expire_date = timezone.now() + timedelta(seconds=self.get_expiry_age())
        
        session_doc = {
            'session_key': self.session_key,
            'session_data': self.encode(session_data),
            'expire_date': expire_date
        }
        
        try:
            collection = self._get_collection()
            collection.update_one(
                {'session_key': self.session_key},
                {'$set': session_doc},
                upsert=True
            )
        except Exception as e:
            raise Exception(f"Failed to save session to MongoDB: {e}")
    
    def delete(self, session_key=None):
        """Delete session from MongoDB"""
        if session_key is None:
            session_key = self.session_key
        
        if session_key:
            try:
                collection = self._get_collection()
                collection.delete_one({'session_key': session_key})
            except Exception:
                pass
    
    def clear_expired(self):
        """Clear expired sessions"""
        try:
            collection = self._get_collection()
            collection.delete_many({
                'expire_date': {'$lt': timezone.now()}
            })
        except Exception:
            pass

