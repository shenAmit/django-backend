"""
URL configuration for openchair project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/shop/', include('apps.shop.urls')),
    path('api/v1/professional/', include('apps.professional.urls')),
    path('api/v1/realestate/', include('apps.realestate.urls')),
    path('api/v1/', include('apps.common.urls')),
    path('', include('apps.admin_panel.urls')),
]

if settings.DEBUG:
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += staticfiles_urlpatterns()

