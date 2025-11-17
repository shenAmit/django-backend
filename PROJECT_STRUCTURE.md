# Django Backend Project Structure

## Directory Structure

```
django-backend/
├── apps/
│   ├── __init__.py
│   ├── accounts/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py          # User, Role, Permission, UserRole, Session, UserDevice
│   │   ├── serializers.py     # User, Auth serializers
│   │   ├── views.py           # AuthViewSet, UserViewSet
│   │   ├── urls.py            # Auth and user routes
│   │   └── admin.py           # Admin configuration
│   ├── common/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py          # ShopType, Service, ProfessionalSkill, Profession, Amenity, Category, FAQ, Page, EmailTemplate, Setting, TicketCategory, Ticket, Favorite, Plan
│   │   ├── serializers.py     # All common model serializers
│   │   ├── views.py           # ViewSets for common models
│   │   ├── urls.py            # Common API routes
│   │   ├── admin.py           # Admin for all common models
│   │   ├── exceptions.py      # Custom exception handler
│   │   ├── middleware.py      # BlockUserMiddleware
│   │   ├── permissions.py     # Custom permissions (IsRole, HasPermission)
│   │   └── utils.py           # Helper functions (S3, file handling)
│   ├── professional/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── views.py           # ProfessionalViewSet
│   │   └── urls.py            # Professional routes
│   ├── shop/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py          # Job model
│   │   ├── serializers.py     # JobSerializer
│   │   ├── views.py           # JobViewSet
│   │   ├── urls.py            # Shop routes
│   │   └── admin.py           # Job admin
│   ├── realestate/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py          # RealEstate model
│   │   ├── serializers.py     # RealEstateSerializer
│   │   ├── views.py           # RealEstateViewSet
│   │   ├── urls.py            # Real estate routes
│   │   └── admin.py           # RealEstate admin
│   └── admin_panel/
│       ├── __init__.py
│       ├── apps.py
│       ├── views.py           # Admin dashboard views
│       └── urls.py            # Admin panel routes
├── openchair/
│   ├── __init__.py
│   ├── settings.py            # Django settings
│   ├── urls.py                # Main URL configuration
│   ├── wsgi.py                # WSGI config
│   └── asgi.py                # ASGI config
├── manage.py
├── requirements.txt           # Python dependencies
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose setup
├── .gitignore
├── README.md                  # Project documentation
└── PROJECT_STRUCTURE.md       # This file
```

## Models Converted

### Accounts App
- **User**: Custom user model with shop/professional/agent details
- **Role**: User roles
- **Permission**: Permissions for roles
- **UserRole**: Many-to-many relationship between users and roles
- **Session**: User session management
- **UserDevice**: Device tracking for push notifications

### Common App
- **ShopType**: Types of shops (Barber, Salon, etc.)
- **Service**: Services offered
- **ProfessionalSkill**: Professional skills
- **Profession**: Professions
- **Amenity**: Amenities
- **Category**: Categories
- **FAQ**: Frequently asked questions
- **Page**: Static pages
- **EmailTemplate**: Email templates
- **Setting**: Application settings
- **TicketCategory**: Support ticket categories
- **Ticket**: Support tickets
- **Favorite**: User favorites
- **Plan**: Subscription plans

### Shop App
- **Job**: Chair/job listings

### Real Estate App
- **RealEstate**: Property listings

## API Endpoints

### Authentication (`/api/v1/auth/`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /logout` - User logout
- `POST /forgot-password` - Forgot password
- `POST /verify-otp` - Verify OTP
- `POST /reset-password` - Reset password

### Shop (`/api/v1/shop/`)
- `GET /shop-type-list` - Get shop types
- `GET /services-list` - Get services
- `GET /amenity-list` - Get amenities
- `POST /post-job` - Create job
- `GET /jobs` - List jobs
- `GET /job/<id>` - Get job details

### Professional (`/api/v1/professional/`)
- `GET /home` - Professional home
- `POST /add-favorite` - Add favorite
- `POST /remove-favorite` - Remove favorite
- `GET /favorite-list` - Get favorites

### Real Estate (`/api/v1/realestate/`)
- `GET /home` - Real estate home
- `GET /search` - Search properties
- `GET /nearby` - Nearby properties
- `POST /` - Create property
- `GET /` - List properties
- `GET /<id>` - Get property details
- `POST /<id>/favorite` - Toggle favorite
- `GET /favorites/list` - Get favorite properties

### Common (`/api/v1/`)
- `GET /get-all-faqs` - Get all FAQs
- `GET /professional-skill-list` - Get professional skills
- `GET /amenity-list` - Get amenities
- `GET /profession-list` - Get professions
- `GET /page/<slug>` - Get page by slug
- `GET /ticket-category-list` - Get ticket categories
- `POST /create-ticket` - Create ticket

### Admin Panel (`/`)
- `GET /` - Admin dashboard
- `GET /admin/` - Django admin panel

## Features Implemented

✅ JWT Authentication with refresh tokens
✅ Session-based authentication
✅ Role-based permissions
✅ Custom user model
✅ All models from Node.js backend
✅ REST API endpoints
✅ Django Admin panel
✅ File upload support (S3 ready)
✅ CORS configuration
✅ PostgreSQL database
✅ Docker support
✅ Custom exception handling
✅ Middleware for blocked users
✅ Custom permissions

## Next Steps

1. Run migrations: `python manage.py makemigrations && python manage.py migrate`
2. Create superuser: `python manage.py createsuperuser`
3. Configure AWS S3 credentials in `.env`
4. Set up email configuration
5. Test all API endpoints
6. Add additional business logic as needed
7. Implement geospatial search for nearby properties
8. Add caching with Redis
9. Set up Celery for background tasks
10. Add API documentation (Swagger/OpenAPI)

