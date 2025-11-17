"""
WSGI config for openchair project.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'openchair.settings')

application = get_wsgi_application()

