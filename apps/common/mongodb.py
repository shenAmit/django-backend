"""
MongoDB connection and utilities
"""
from django.conf import settings
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import logging

logger = logging.getLogger(__name__)

# Global MongoDB connection
_mongo_client = None
_mongo_db = None


def get_mongo_client():
    """Get MongoDB client instance"""
    global _mongo_client
    if _mongo_client is None:
        try:
            _mongo_client = MongoClient(settings.MONGODB_URI)
            # Test connection
            _mongo_client.admin.command('ping')
            logger.info("✅ MongoDB Connected")
        except ConnectionFailure as e:
            logger.error(f"❌ MongoDB Connection Error: {e}")
            raise
    return _mongo_client


def get_mongo_db():
    """Get MongoDB database instance"""
    global _mongo_db
    if _mongo_db is None:
        client = get_mongo_client()
        # Extract database name from URI or use default
        db_name = 'open-chair-p'
        if 'mongodb+srv://' in settings.MONGODB_URI or 'mongodb://' in settings.MONGODB_URI:
            # Try to extract from URI
            if '/open-chair-p' in settings.MONGODB_URI:
                db_name = 'open-chair-p'
        _mongo_db = client[db_name]
    return _mongo_db


def get_collection(collection_name):
    """Get a MongoDB collection"""
    db = get_mongo_db()
    return db[collection_name]

