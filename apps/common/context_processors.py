"""
Context processors for Django templates
These variables will be available in all templates
"""
from apps.common.models import Setting


def admin_context(request):
    """
    Add admin panel context variables to all templates
    """
    context = {}
    
    # Get settings
    try:
        settings = Setting.objects.filter(key__in=['app_name', 'site_logo']).values('key', 'value')
        settings_map = {}
        for setting in settings:
            settings_map[setting['key']] = setting['value']
        context['setting'] = settings_map
    except Exception:
        context['setting'] = {}
    
    # Compute sidebar menu visibility flags
    if request.user.is_authenticated:
        current_path = request.path
        is_management_page = current_path.startswith('/management')
        show_all_menus = is_management_page
        
        context['current_path'] = current_path
        context['is_management_page'] = is_management_page
        context['show_all_menus'] = show_all_menus
    else:
        context['current_path'] = request.path
        context['is_management_page'] = False
        context['show_all_menus'] = False
    
    # Add success and error messages (from messages framework)
    from django.contrib.messages import get_messages
    messages = get_messages(request)
    success_messages = []
    error_messages = []
    
    for message in messages:
        if message.tags == 'success':
            success_messages.append(str(message))
        elif message.tags == 'error':
            error_messages.append(str(message))
    
    import json
    context['success'] = json.dumps(success_messages)
    context['error'] = json.dumps(error_messages)
    
    return context

