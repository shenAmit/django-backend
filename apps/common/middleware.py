from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin


class BlockUserMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if hasattr(request, 'user') and request.user.is_authenticated:
            if hasattr(request.user, 'is_block') and request.user.is_block:
                return JsonResponse({
                    'success': False,
                    'message': 'Your account has been blocked'
                }, status=403)
        return None

