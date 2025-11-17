from django.urls import path
from .views import (
    dashboard, admin_login, admin_logout,
    roles_index, roles_create, roles_edit, roles_store, roles_delete,
    permissions_index, permissions_edit, permissions_store, permissions_delete,
    shop_types_index, shop_types_store, shop_types_delete,
    amenities_index, amenities_store, amenities_delete,
    professions_index, professions_store, professions_delete,
    services_index, services_store, services_delete,
    professional_skills_index, professional_skills_store, professional_skills_delete,
    user_management_all_users, user_management_professionals, user_management_shops,
    user_management_real_estate_agents,
    listings_chairs, listings_properties,
    tickets_categories, tickets_index,
    faqs_index,
    pages_index,
    settings_index,
    management_index,
    categories_index,
    email_templates_index,
)

urlpatterns = [
    # Authentication
    path('login/', admin_login, name='admin-login'),
    path('logout/', admin_logout, name='admin-logout'),
    
    # Dashboard
    path('', dashboard, name='admin-dashboard'),
    
    # Roles
    path('roles/', roles_index, name='admin-roles'),
    path('roles/create/', roles_create, name='admin-roles-create'),
    path('roles/edit/<int:id>/', roles_edit, name='admin-roles-edit'),
    path('save-role/', roles_store, name='admin-roles-store'),
    path('delete-role/<int:id>/', roles_delete, name='admin-roles-delete'),
    
    # Permissions
    path('permissions/', permissions_index, name='admin-permissions'),
    path('permissions/edit/<int:id>/', permissions_edit, name='admin-permissions-edit'),
    path('save-permission/', permissions_store, name='admin-permissions-store'),
    path('delete-permission/<int:id>/', permissions_delete, name='admin-permissions-delete'),
    
    # Shop Types
    path('shop-types/', shop_types_index, name='admin-shop-types'),
    path('save-shop-type/', shop_types_store, name='admin-shop-types-store'),
    path('delete-shop-type/<int:id>/', shop_types_delete, name='admin-shop-types-delete'),
    
    # Amenities
    path('amenities/', amenities_index, name='admin-amenities'),
    path('save-amenity/', amenities_store, name='admin-amenities-store'),
    path('delete-amenity/<int:id>/', amenities_delete, name='admin-amenities-delete'),
    
    # Professions
    path('professions/', professions_index, name='admin-professions'),
    path('save-profession/', professions_store, name='admin-professions-store'),
    path('delete-profession/<int:id>/', professions_delete, name='admin-professions-delete'),
    
    # Services
    path('services/', services_index, name='admin-services'),
    path('save-service/', services_store, name='admin-services-store'),
    path('delete-service/<int:id>/', services_delete, name='admin-services-delete'),
    
    # Professional Skills
    path('professional-skills/', professional_skills_index, name='admin-professional-skills'),
    path('save-professional-skill/', professional_skills_store, name='admin-professional-skills-store'),
    path('delete-professional-skill/<int:id>/', professional_skills_delete, name='admin-professional-skills-delete'),
    
    # User Management
    path('user-management/all-users/', user_management_all_users, name='admin-user-management-all-users'),
    path('user-management/professionals/', user_management_professionals, name='admin-user-management-professionals'),
    path('user-management/shops/', user_management_shops, name='admin-user-management-shops'),
    path('user-management/real-estate-agents/', user_management_real_estate_agents, name='admin-user-management-real-estate-agents'),
    
    # Listings
    path('listings/chairs/', listings_chairs, name='admin-listings-chairs'),
    path('listings/properties/', listings_properties, name='admin-listings-properties'),
    
    # Tickets
    path('tickets/categories/', tickets_categories, name='admin-tickets-categories'),
    path('tickets/', tickets_index, name='admin-tickets'),
    
    # FAQs
    path('faqs/', faqs_index, name='admin-faqs'),
    
    # Pages
    path('pages/', pages_index, name='admin-pages'),
    
    # Settings
    path('settings/', settings_index, name='admin-settings'),
    
    # Management
    path('management/', management_index, name='admin-management'),
    
    # Categories
    path('category/', categories_index, name='admin-categories'),
    
    # Email Templates
    path('email-templates/', email_templates_index, name='admin-email-templates'),
]
