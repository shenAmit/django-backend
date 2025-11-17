import json
import base64
from django.conf import settings
import boto3
from botocore.exceptions import ClientError


def create_file_url(file_path):
    """Create file URL from path"""
    if not file_path:
        return None
    
    if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
        return f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{file_path}"
    else:
        return f"{settings.MEDIA_URL}{file_path}"


def upload_to_s3(file_obj, bucket_name, object_name):
    """Upload file to S3"""
    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )
    
    try:
        s3_client.upload_fileobj(file_obj, bucket_name, object_name)
        return f"https://{bucket_name}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{object_name}"
    except ClientError as e:
        print(f"Error uploading to S3: {e}")
        return None


def decode_file_path(encoded):
    """Decode base64 encoded file path"""
    try:
        decoded = base64.b64decode(encoded).decode('utf-8')
        return decoded
    except Exception:
        return None

