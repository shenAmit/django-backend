from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ShopTypeViewSet, ServiceViewSet, ProfessionalSkillViewSet,
    ProfessionViewSet, AmenityViewSet, FAQViewSet, PageViewSet,
    TicketCategoryViewSet, TicketViewSet
)

router = DefaultRouter()
router.register(r'shop-types', ShopTypeViewSet, basename='shop-types')
router.register(r'services', ServiceViewSet, basename='services')
router.register(r'professional-skills', ProfessionalSkillViewSet, basename='professional-skills')
router.register(r'professions', ProfessionViewSet, basename='professions')
router.register(r'amenities', AmenityViewSet, basename='amenities')
router.register(r'faqs', FAQViewSet, basename='faqs')
router.register(r'pages', PageViewSet, basename='pages')
router.register(r'ticket-categories', TicketCategoryViewSet, basename='ticket-categories')
router.register(r'tickets', TicketViewSet, basename='tickets')

urlpatterns = [
    path('', include(router.urls)),
    path('get-all-faqs', FAQViewSet.as_view({'get': 'list'}), name='get-all-faqs'),
    path('professional-skill-list', ProfessionalSkillViewSet.as_view({'get': 'list'}), name='professional-skill-list'),
    path('amenity-list', AmenityViewSet.as_view({'get': 'list'}), name='amenity-list'),
    path('profession-list', ProfessionViewSet.as_view({'get': 'list'}), name='profession-list'),
    path('faq-list', FAQViewSet.as_view({'get': 'list'}), name='faq-list'),
    path('page/<str:slug>', PageViewSet.as_view({'get': 'retrieve'}), name='page-detail'),
    path('page-content', PageViewSet.as_view({'get': 'content'}), name='page-content'),
    path('ticket-category-list', TicketCategoryViewSet.as_view({'get': 'list'}), name='ticket-category-list'),
    path('create-ticket', TicketViewSet.as_view({'post': 'create'}), name='create-ticket'),
]

