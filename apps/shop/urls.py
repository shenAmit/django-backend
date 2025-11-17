from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobViewSet

router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='jobs')

urlpatterns = [
    path('', include(router.urls)),
    path('shop-type-list', JobViewSet.as_view({'get': 'type_list'}), name='shop-type-list'),
    path('services-list', JobViewSet.as_view({'get': 'service_list'}), name='services-list'),
    path('amenity-list', JobViewSet.as_view({'get': 'amenity_list'}), name='amenity-list'),
    path('post-job', JobViewSet.as_view({'post': 'create'}), name='post-job'),
    path('job/<int:pk>', JobViewSet.as_view({'get': 'retrieve'}), name='job-detail'),
    path('jobs', JobViewSet.as_view({'get': 'list'}), name='jobs-list'),
]

