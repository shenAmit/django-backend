from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfessionalViewSet

router = DefaultRouter()
router.register(r'', ProfessionalViewSet, basename='professional')

urlpatterns = [
    path('', include(router.urls)),
    path('home', ProfessionalViewSet.as_view({'get': 'home'}), name='professional-home'),
    path('add-favorite', ProfessionalViewSet.as_view({'post': 'add_favorite'}), name='add-favorite'),
    path('remove-favorite', ProfessionalViewSet.as_view({'post': 'remove_favorite'}), name='remove-favorite'),
    path('favorite-list', ProfessionalViewSet.as_view({'get': 'favorite_list'}), name='favorite-list'),
]

