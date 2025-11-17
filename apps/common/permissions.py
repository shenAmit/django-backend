from rest_framework import permissions


class IsRole(permissions.BasePermission):
    """
    Permission check for user roles
    """
    def __init__(self, required_role):
        self.required_role = required_role
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Check if user has the required role
        user_roles = request.user.user_roles.all()
        return any(role.role.name.lower() == self.required_role.lower() for role in user_roles)


class HasPermission(permissions.BasePermission):
    """
    Permission check for specific permissions
    """
    def __init__(self, permission_name):
        self.permission_name = permission_name
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Check if user has the required permission through roles
        user_roles = request.user.user_roles.all()
        for user_role in user_roles:
            role_permissions = user_role.role.permissions.all()
            if any(perm.name == self.permission_name for perm in role_permissions):
                return True
        return False

