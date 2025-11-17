from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json
from apps.accounts.models import User, Role, Permission
from apps.common.models import (
    ShopType, Service, ProfessionalSkill, Profession, Amenity,
    Category, FAQ, Page, EmailTemplate, Setting, TicketCategory, Ticket
)
from apps.shop.models import Job
from apps.realestate.models import RealEstate
from django.contrib.auth import authenticate, login, logout


@staff_member_required
def dashboard(request):
    """Admin dashboard view"""
    from datetime import timedelta
    from django.utils import timezone
    
    # Get user statistics
    total_users = User.objects.count()
    
    # Count shops and professionals by role
    shop_role = Role.objects.filter(name__iexact='shop').first()
    professional_role = Role.objects.filter(name__iexact='professional').first()
    
    total_shops = User.objects.filter(user_roles__role=shop_role).count() if shop_role else 0
    total_professionals = User.objects.filter(user_roles__role=professional_role).count() if professional_role else 0
    active_users = User.objects.filter(is_block=False).count()
    blocked_users = User.objects.filter(is_block=True).count()
    
    # Get master table statistics
    total_shop_types = ShopType.objects.count()
    active_shop_types = ShopType.objects.filter(status=True).count()
    total_amenities = Amenity.objects.count()
    active_amenities = Amenity.objects.filter(status=True).count()
    total_professions = Profession.objects.count()
    active_professions = Profession.objects.filter(status=True).count()
    total_services = Service.objects.count()
    active_services = Service.objects.filter(status=True).count()
    total_professional_skills = ProfessionalSkill.objects.count()
    active_professional_skills = ProfessionalSkill.objects.filter(status=True).count()
    
    # Get content statistics
    total_pages = Page.objects.count()
    total_faqs = FAQ.objects.count()
    total_categories = Category.objects.count()
    
    # Get access control statistics
    total_roles = Role.objects.count()
    total_permissions = Permission.objects.count()
    
    # Get recent users (last 7 days)
    seven_days_ago = timezone.now() - timedelta(days=7)
    recent_users = User.objects.filter(date_joined__gte=seven_days_ago).order_by('-date_joined')[:5]
    
    # Get recent shop types
    recent_shop_types = ShopType.objects.filter(created_at__gte=seven_days_ago).order_by('-created_at')[:3]
    
    # Get recent amenities
    recent_amenities = Amenity.objects.filter(created_at__gte=seven_days_ago).order_by('-created_at')[:3]
    
    # Get recent professions
    recent_professions = Profession.objects.filter(created_at__gte=seven_days_ago).order_by('-created_at')[:3]
    
    # Get recent services
    recent_services = Service.objects.filter(created_at__gte=seven_days_ago).order_by('-created_at')[:3]
    
    # Calculate growth percentages (mock for now)
    user_growth_percentage = 12.5
    shop_growth_percentage = 8.3
    professional_growth_percentage = 15.7
    
    stats = {
        'users': {
            'total': total_users,
            'shops': total_shops,
            'professionals': total_professionals,
            'active': active_users,
            'blocked': blocked_users,
            'growth': user_growth_percentage,
        },
        'masterTables': {
            'shopTypes': {'total': total_shop_types, 'active': active_shop_types},
            'amenities': {'total': total_amenities, 'active': active_amenities},
            'professions': {'total': total_professions, 'active': active_professions},
            'services': {'total': total_services, 'active': active_services},
            'professionalSkills': {
                'total': total_professional_skills,
                'active': active_professional_skills,
            },
        },
        'content': {
            'pages': total_pages,
            'faqs': total_faqs,
            'categories': total_categories,
        },
        'accessControl': {
            'roles': total_roles,
            'permissions': total_permissions,
        },
        'recent': {
            'users': recent_users,
            'shopTypes': recent_shop_types,
            'amenities': recent_amenities,
            'professions': recent_professions,
            'services': recent_services,
        },
        'growth': {
            'shops': shop_growth_percentage,
            'professionals': professional_growth_percentage,
        },
    }
    
    context = {
        'stats': stats,
        'title': 'Dashboard',
    }
    return render(request, 'admin/dashboard.html', context)


def admin_login(request):
    """Admin login view"""
    if request.user.is_authenticated and request.user.is_staff:
        return redirect('admin-dashboard')
    
    error = None
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        if email and password:
            # Authenticate using email as username (since USERNAME_FIELD is email)
            user = authenticate(request, username=email, password=password)
            if user is not None:
                if user.is_staff and user.is_active:
                    login(request, user)
                    return redirect('admin-dashboard')
                else:
                    error = "You don't have admin access or your account is inactive."
            else:
                error = "Invalid credentials. Please check your email and password."
        else:
            error = "Please provide both email and password."
    
    return render(request, 'authentication/sign-in.html', {'error': error})


def admin_logout(request):
    """Admin logout view"""
    logout(request)
    return redirect('admin-login')


# ==================== ROLE ROUTES ====================
@staff_member_required
def roles_index(request):
    """List all roles"""
    roles = Role.objects.all().order_by('-created_at')
    context = {
        'title': 'Roles',
        'roles': roles,
    }
    return render(request, 'crud/roles/index.html', context)


@staff_member_required
def roles_create(request):
    """Create role form"""
    permissions = Permission.objects.all()
    context = {
        'title': 'Create Role',
        'permissions': permissions,
    }
    return render(request, 'crud/roles/create.html', context)


@staff_member_required
def roles_edit(request, id):
    """Edit role form"""
    try:
        role = Role.objects.get(id=id)
        permissions = Permission.objects.all()
        context = {
            'title': 'Edit Role',
            'role': role,
            'permissions': permissions,
        }
        return render(request, 'crud/roles/create.html', context)
    except Role.DoesNotExist:
        return redirect('admin-roles')


@staff_member_required
@require_http_methods(["POST"])
def roles_store(request):
    """Save role (create or update)"""
    # TODO: Implement role save logic
    return JsonResponse({'status': True, 'message': 'Role saved successfully'})


@staff_member_required
@require_http_methods(["POST"])
def roles_delete(request, id):
    """Delete role"""
    try:
        role = Role.objects.get(id=id)
        role.delete()
        return JsonResponse({'status': True, 'message': 'Role deleted successfully'})
    except Role.DoesNotExist:
        return JsonResponse({'status': False, 'message': 'Role not found'}, status=404)


# ==================== PERMISSION ROUTES ====================
@staff_member_required
def permissions_index(request):
    """List all permissions"""
    permissions = Permission.objects.all().order_by('-created_at')
    context = {
        'title': 'Permissions',
        'permissions': permissions,
    }
    return render(request, 'crud/permissions/index.html', context)


@staff_member_required
def permissions_edit(request, id):
    """Edit permission form"""
    try:
        permission = Permission.objects.get(id=id)
        context = {
            'title': 'Edit Permission',
            'permission': permission,
        }
        return render(request, 'crud/permissions/create.html', context)
    except Permission.DoesNotExist:
        return redirect('admin-permissions')


@staff_member_required
@require_http_methods(["POST"])
def permissions_store(request):
    """Save permission (create or update)"""
    # TODO: Implement permission save logic
    return JsonResponse({'status': True, 'message': 'Permission saved successfully'})


@staff_member_required
@require_http_methods(["POST"])
def permissions_delete(request, id):
    """Delete permission"""
    try:
        permission = Permission.objects.get(id=id)
        permission.delete()
        return JsonResponse({'status': True, 'message': 'Permission deleted successfully'})
    except Permission.DoesNotExist:
        return JsonResponse({'status': False, 'message': 'Permission not found'}, status=404)


# ==================== SHOP TYPE ROUTES ====================
@staff_member_required
def shop_types_index(request):
    """List all shop types"""
    shop_types = ShopType.objects.all().order_by('-created_at')
    context = {
        'title': 'Shop Types',
        'shop_types': shop_types,
    }
    return render(request, 'crud/shopTypes/index.html', context)


@staff_member_required
@require_http_methods(["POST"])
def shop_types_store(request):
    """Save shop type"""
    # TODO: Implement shop type save logic
    return JsonResponse({'status': True, 'message': 'Shop type saved successfully'})


@staff_member_required
@require_http_methods(["POST"])
def shop_types_delete(request, id):
    """Delete shop type"""
    try:
        shop_type = ShopType.objects.get(id=id)
        shop_type.delete()
        return JsonResponse({'status': True, 'message': 'Shop type deleted successfully'})
    except ShopType.DoesNotExist:
        return JsonResponse({'status': False, 'message': 'Shop type not found'}, status=404)


# ==================== AMENITY ROUTES ====================
@staff_member_required
def amenities_index(request):
    """List all amenities"""
    amenities = Amenity.objects.all().order_by('-created_at')
    context = {
        'title': 'Amenities',
        'amenities': amenities,
    }
    return render(request, 'crud/amenities/index.html', context)


@staff_member_required
@require_http_methods(["POST"])
def amenities_store(request):
    """Save amenity"""
    # TODO: Implement amenity save logic
    return JsonResponse({'status': True, 'message': 'Amenity saved successfully'})


@staff_member_required
@require_http_methods(["POST"])
def amenities_delete(request, id):
    """Delete amenity"""
    try:
        amenity = Amenity.objects.get(id=id)
        amenity.delete()
        return JsonResponse({'status': True, 'message': 'Amenity deleted successfully'})
    except Amenity.DoesNotExist:
        return JsonResponse({'status': False, 'message': 'Amenity not found'}, status=404)


# ==================== PROFESSION ROUTES ====================
@staff_member_required
def professions_index(request):
    """List all professions"""
    professions = Profession.objects.all().order_by('-created_at')
    context = {
        'title': 'Professions',
        'professions': professions,
    }
    return render(request, 'crud/professions/index.html', context)


@staff_member_required
@require_http_methods(["POST"])
def professions_store(request):
    """Save profession"""
    # TODO: Implement profession save logic
    return JsonResponse({'status': True, 'message': 'Profession saved successfully'})


@staff_member_required
@require_http_methods(["POST"])
def professions_delete(request, id):
    """Delete profession"""
    try:
        profession = Profession.objects.get(id=id)
        profession.delete()
        return JsonResponse({'status': True, 'message': 'Profession deleted successfully'})
    except Profession.DoesNotExist:
        return JsonResponse({'status': False, 'message': 'Profession not found'}, status=404)


# ==================== SERVICE ROUTES ====================
@staff_member_required
def services_index(request):
    """List all services"""
    services = Service.objects.all().order_by('-created_at')
    context = {
        'title': 'Services',
        'services': services,
    }
    return render(request, 'crud/services/index.html', context)


@staff_member_required
@require_http_methods(["POST"])
def services_store(request):
    """Save service"""
    # TODO: Implement service save logic
    return JsonResponse({'status': True, 'message': 'Service saved successfully'})


@staff_member_required
@require_http_methods(["POST"])
def services_delete(request, id):
    """Delete service"""
    try:
        service = Service.objects.get(id=id)
        service.delete()
        return JsonResponse({'status': True, 'message': 'Service deleted successfully'})
    except Service.DoesNotExist:
        return JsonResponse({'status': False, 'message': 'Service not found'}, status=404)


# ==================== PROFESSIONAL SKILL ROUTES ====================
@staff_member_required
def professional_skills_index(request):
    """List all professional skills"""
    professional_skills = ProfessionalSkill.objects.all().order_by('-created_at')
    context = {
        'title': 'Professional Skills',
        'professional_skills': professional_skills,
    }
    return render(request, 'crud/professionalSkills/index.html', context)


@staff_member_required
@require_http_methods(["POST"])
def professional_skills_store(request):
    """Save professional skill"""
    # TODO: Implement professional skill save logic
    return JsonResponse({'status': True, 'message': 'Professional skill saved successfully'})


@staff_member_required
@require_http_methods(["POST"])
def professional_skills_delete(request, id):
    """Delete professional skill"""
    try:
        professional_skill = ProfessionalSkill.objects.get(id=id)
        professional_skill.delete()
        return JsonResponse({'status': True, 'message': 'Professional skill deleted successfully'})
    except ProfessionalSkill.DoesNotExist:
        return JsonResponse({'status': False, 'message': 'Professional skill not found'}, status=404)


# ==================== USER MANAGEMENT ROUTES ====================
@staff_member_required
def user_management_all_users(request):
    """List all users"""
    from django.core.paginator import Paginator
    from django.db.models import Q
    from apps.accounts.models import User, Role
    
    page = request.GET.get('page', 1)
    limit = int(request.GET.get('limit', 10))
    search = request.GET.get('search', '')
    selected_role = request.GET.get('role', '')
    
    # Build filter
    filter_kwargs = {'is_superuser': False}  # Exclude superusers
    
    # Search by name or email
    if search:
        filter_kwargs['Q'] = Q(name__icontains=search) | Q(email__icontains=search)
    
    # Filter by role
    if selected_role:
        filter_kwargs['user_roles__role_id'] = selected_role
    
    # Get roles for dropdown (exclude admin)
    roles = Role.objects.exclude(name='admin').all()
    
    # Get users
    users_query = User.objects.filter(is_superuser=False)
    
    # Apply search filter
    if search:
        users_query = users_query.filter(Q(name__icontains=search) | Q(email__icontains=search))
    
    # Apply role filter
    if selected_role:
        users_query = users_query.filter(user_roles__role_id=selected_role)
    
    # Get total count before pagination
    total_users = users_query.count()
    
    # Paginate
    paginator = Paginator(users_query.select_related('shop_type').prefetch_related('user_roles__role').order_by('-date_joined'), limit)
    
    try:
        users_page = paginator.page(page)
    except:
        users_page = paginator.page(1)
    
    # Process users for template
    users = []
    for idx, user in enumerate(users_page, start=1):
        user_data = {
            'id': user.id,
            'name': user.name or 'N/A',
            'email': user.email,
            'profile_picture': user.profile_picture if user.profile_picture else None,
            'is_block': user.is_block,
            'created_at': user.date_joined,
            'roles': [ur.role.name for ur in user.user_roles.all()],
            'shop_type': user.shop_type.name if user.shop_type else None,
            'serial_number': (users_page.number - 1) * limit + idx,
        }
        users.append(user_data)
    
    # Build pagination context
    pagination = {
        'current_page': users_page.number,
        'total_pages': paginator.num_pages,
        'total_items': total_users,
        'per_page': limit,
        'has_previous': users_page.has_previous(),
        'has_next': users_page.has_next(),
        'previous_page': users_page.previous_page_number() if users_page.has_previous() else None,
        'next_page': users_page.next_page_number() if users_page.has_next() else None,
    }
    
    context = {
        'users': users,
        'roles': roles,
        'selected_role': selected_role,
        'search': search,
        'pagination': pagination,
        'page_title': 'All Users',
        'current_view': 'allUsers',
    }
    
    return render(request, 'crud/userManagement/allUsers.html', context)


@staff_member_required
def user_management_professionals(request):
    """List professional users"""
    professional_role = Role.objects.filter(name__iexact='professional').first()
    if professional_role:
        users = User.objects.filter(user_roles__role=professional_role).order_by('-date_joined')
    else:
        users = User.objects.none()
    context = {
        'title': 'Professionals',
        'users': users,
    }
    return render(request, 'crud/userManagement/professionals.html', context)


@staff_member_required
def user_management_shops(request):
    """List shop users"""
    shop_role = Role.objects.filter(name__iexact='shop').first()
    if shop_role:
        users = User.objects.filter(user_roles__role=shop_role).order_by('-date_joined')
    else:
        users = User.objects.none()
    context = {
        'title': 'Shops',
        'users': users,
    }
    return render(request, 'crud/userManagement/shops.html', context)


@staff_member_required
def user_management_real_estate_agents(request):
    """List real estate agent users"""
    agent_role = Role.objects.filter(name__iexact='agent').first()
    if agent_role:
        users = User.objects.filter(user_roles__role=agent_role).order_by('-date_joined')
    else:
        users = User.objects.none()
    context = {
        'title': 'Real Estate Agents',
        'users': users,
    }
    return render(request, 'crud/userManagement/realEstateAgents.html', context)


# ==================== LISTINGS ROUTES ====================
@staff_member_required
def listings_chairs(request):
    """List chair listings (jobs)"""
    jobs = Job.objects.all().order_by('-created_at')
    context = {
        'title': 'Chair Listings',
        'jobs': jobs,
    }
    return render(request, 'crud/listings/chairListings.html', context)


@staff_member_required
def listings_properties(request):
    """List property listings"""
    properties = RealEstate.objects.all().order_by('-created_at')
    context = {
        'title': 'Property Listings',
        'properties': properties,
    }
    return render(request, 'crud/listings/propertyListings.html', context)


# ==================== TICKETS ROUTES ====================
@staff_member_required
def tickets_categories(request):
    """List ticket categories"""
    categories = TicketCategory.objects.all().order_by('-created_at')
    context = {
        'title': 'Ticket Categories',
        'categories': categories,
    }
    return render(request, 'crud/tickets/categories.html', context)


@staff_member_required
def tickets_index(request):
    """List tickets"""
    tickets = Ticket.objects.all().order_by('-created_at')
    context = {
        'title': 'Tickets',
        'tickets': tickets,
    }
    return render(request, 'crud/tickets/tickets.html', context)


# ==================== FAQ ROUTES ====================
@staff_member_required
def faqs_index(request):
    """List FAQs"""
    faqs = FAQ.objects.all().order_by('-created_at')
    context = {
        'title': 'FAQs',
        'faqs': faqs,
    }
    return render(request, 'crud/faqs/index.html', context)


# ==================== PAGES ROUTES ====================
@staff_member_required
def pages_index(request):
    """List pages"""
    pages = Page.objects.all().order_by('-created_at')
    context = {
        'title': 'Pages',
        'pages': pages,
    }
    return render(request, 'crud/pages/index.html', context)


# ==================== SETTINGS ROUTES ====================
@staff_member_required
def settings_index(request):
    """Settings page"""
    settings = Setting.objects.all()
    settings_map = {s.key: s.value for s in settings}
    context = {
        'title': 'Settings',
        'settings': settings_map,
    }
    return render(request, 'settings.html', context)


# ==================== MANAGEMENT ROUTES ====================
@staff_member_required
def management_index(request):
    """Admin management page"""
    context = {
        'title': 'Account Management',
        'user': request.user,
    }
    return render(request, 'crud/management/index.html', context)


# ==================== CATEGORY ROUTES ====================
@staff_member_required
def categories_index(request):
    """List categories"""
    categories = Category.objects.all().order_by('-created_at')
    context = {
        'title': 'Categories',
        'categories': categories,
    }
    return render(request, 'crud/categories/index.html', context)


# ==================== EMAIL TEMPLATES ROUTES ====================
@staff_member_required
def email_templates_index(request):
    """List email templates"""
    templates = EmailTemplate.objects.all().order_by('-created_at')
    context = {
        'title': 'Email Templates',
        'templates': templates,
    }
    return render(request, 'crud/emailTemplates/index.html', context)
