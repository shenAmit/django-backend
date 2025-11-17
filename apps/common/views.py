from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import (
    ShopType, Service, ProfessionalSkill, Profession, Amenity,
    Category, FAQ, Page, TicketCategory, Ticket
)
from .serializers import (
    ShopTypeSerializer, ServiceSerializer, ProfessionalSkillSerializer,
    ProfessionSerializer, AmenitySerializer, CategorySerializer,
    FAQSerializer, PageSerializer, TicketCategorySerializer, TicketSerializer
)


class ShopTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ShopType.objects.filter(status=True)
    serializer_class = ShopTypeSerializer
    permission_classes = [AllowAny]


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(status=True)
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]


class ProfessionalSkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProfessionalSkill.objects.filter(status=True)
    serializer_class = ProfessionalSkillSerializer
    permission_classes = [AllowAny]


class ProfessionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Profession.objects.filter(status=True)
    serializer_class = ProfessionSerializer
    permission_classes = [AllowAny]


class AmenityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Amenity.objects.filter(status=True)
    serializer_class = AmenitySerializer
    permission_classes = [AllowAny]


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(status=True)
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]


class PageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Page.objects.filter(status=True)
    serializer_class = PageSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    @action(detail=True, methods=['get'])
    def content(self, request, slug=None):
        page = get_object_or_404(Page, slug=slug, status=True)
        serializer = self.get_serializer(page)
        return Response({
            'success': True,
            'data': serializer.data
        })


class TicketCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TicketCategory.objects.filter(status=True)
    serializer_class = TicketCategorySerializer
    permission_classes = [IsAuthenticated]


class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            'success': True,
            'message': 'Ticket created successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)

