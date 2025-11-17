from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import RealEstate
from .serializers import RealEstateSerializer
from apps.common.models import Favorite


class RealEstateViewSet(viewsets.ModelViewSet):
    serializer_class = RealEstateSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['property_type', 'pricing_model', 'status', 'zoning_type']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'pricing_amount', 'views']
    ordering = ['-created_at']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'search', 'nearby']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        if self.action == 'my_properties':
            return RealEstate.objects.filter(owner=self.request.user)
        return RealEstate.objects.filter(status='active', listing_is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def home(self, request):
        properties = self.get_queryset()[:10]
        serializer = self.get_serializer(properties, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def my_properties(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        lat = request.query_params.get('latitude')
        lng = request.query_params.get('longitude')
        # TODO: Implement geospatial search
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        property_obj = self.get_object()
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            property=property_obj,
            type='realestate'
        )
        return Response({
            'success': True,
            'message': 'Added to favorites' if created else 'Already in favorites'
        })
    
    @action(detail=False, methods=['get'])
    def favorites_list(self, request):
        favorites = Favorite.objects.filter(user=request.user, type='realestate')
        properties = [f.property for f in favorites if f.property]
        serializer = self.get_serializer(properties, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })

