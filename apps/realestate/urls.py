from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RealEstateViewSet

router = DefaultRouter()
router.register(r'', RealEstateViewSet, basename='realestate')

urlpatterns = [
    path('', include(router.urls)),
    path('home', RealEstateViewSet.as_view({'get': 'home'}), name='realestate-home'),
    path('search', RealEstateViewSet.as_view({'get': 'search'}), name='realestate-search'),
    path('nearby', RealEstateViewSet.as_view({'get': 'nearby'}), name='realestate-nearby'),
    path('favorites/list', RealEstateViewSet.as_view({'get': 'favorites_list'}), name='realestate-favorites'),
]

