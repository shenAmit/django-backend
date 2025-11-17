from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.common.models import Favorite
from apps.shop.models import Job
from apps.realestate.models import RealEstate


class ProfessionalViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def home(self, request):
        # Get recent chairs, nearest chairs, etc.
        jobs = Job.objects.filter(status='active').order_by('-created_at')[:10]
        return Response({
            'success': True,
            'data': {
                'recent_chairs': [{'id': j.id, 'chair_name': j.chair_name} for j in jobs]
            }
        })
    
    @action(detail=False, methods=['post'])
    def add_favorite(self, request):
        job_id = request.data.get('job_id')
        professional_id = request.data.get('professional_id')
        property_id = request.data.get('property_id')
        favorite_type = request.data.get('type', 'chair')
        
        favorite_data = {
            'user': request.user,
            'type': favorite_type
        }
        
        if job_id:
            favorite_data['job_id'] = job_id
        elif professional_id:
            favorite_data['professional_id'] = professional_id
        elif property_id:
            favorite_data['property_id'] = property_id
        
        favorite, created = Favorite.objects.get_or_create(**favorite_data)
        
        return Response({
            'success': True,
            'message': 'Added to favorites' if created else 'Already in favorites',
            'data': {'id': favorite.id}
        })
    
    @action(detail=False, methods=['post'])
    def remove_favorite(self, request):
        favorite_id = request.data.get('favorite_id')
        try:
            favorite = Favorite.objects.get(id=favorite_id, user=request.user)
            favorite.delete()
            return Response({
                'success': True,
                'message': 'Removed from favorites'
            })
        except Favorite.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Favorite not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def favorite_list(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        return Response({
            'success': True,
            'data': [{'id': f.id, 'type': f.type} for f in favorites]
        })

