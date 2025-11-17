from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Job
from .serializers import JobSerializer
from apps.common.models import ShopType, Service, Amenity
from apps.common.serializers import ShopTypeSerializer, ServiceSerializer, AmenitySerializer


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['chair_name', 'description']
    ordering_fields = ['created_at', 'availability_end_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        if self.action == 'list' and self.request.user.user_roles.filter(role__name__iexact='shop').exists():
            return Job.objects.filter(shop=self.request.user)
        return Job.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(shop=self.request.user)
    
    @action(detail=False, methods=['get'])
    def type_list(self, request):
        shop_types = ShopType.objects.filter(status=True)
        serializer = ShopTypeSerializer(shop_types, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def service_list(self, request):
        services = Service.objects.filter(status=True)
        serializer = ServiceSerializer(services, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def amenity_list(self, request):
        amenities = Amenity.objects.filter(status=True)
        serializer = AmenitySerializer(amenities, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })

