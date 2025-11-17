# OpenChair Django Backend

Django REST Framework backend for OpenChair application, converted from Node.js/Express.

## Project Structure

```
django-backend/
├── apps/
│   ├── accounts/          # User, Role, Permission models
│   ├── common/            # Shared models (ShopType, Service, FAQ, etc.)
│   ├── professional/      # Professional-specific functionality
│   ├── shop/              # Shop-specific functionality
│   ├── realestate/        # Real estate functionality
│   └── admin_panel/       # Admin panel views
├── openchair/             # Project settings
├── manage.py
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

## Setup

### Local Development

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run server:
```bash
python manage.py runserver
```

### Docker Setup

1. Build and run:
```bash
docker-compose up --build
```

2. Create superuser:
```bash
docker-compose exec web python manage.py createsuperuser
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/verify-otp` - Verify OTP
- `POST /api/v1/auth/reset-password` - Reset password

### Shop Routes
- `GET /api/v1/shop/home` - Shop home
- `GET /api/v1/shop/shop-type-list` - Get shop types
- `GET /api/v1/shop/services-list` - Get services
- `POST /api/v1/shop/post-job` - Post job
- `GET /api/v1/shop/jobs` - Get jobs list

### Professional Routes
- `GET /api/v1/professional/home` - Professional home
- `GET /api/v1/professional/favorite-list` - Get favorites
- `PUT /api/v1/professional/update-profile` - Update profile

### Real Estate Routes
- `GET /api/v1/realestate/home` - Real estate home
- `GET /api/v1/realestate/search` - Search properties
- `POST /api/v1/realestate/` - Create property

### Common Routes
- `GET /api/v1/get-all-faqs` - Get all FAQs
- `GET /api/v1/page/:slug` - Get page content
- `GET /api/v1/professional-skill-list` - Get professional skills

### Admin Routes
- `GET /admin/` - Django admin panel
- `GET /` - Admin dashboard (web interface)

## Database Models

- **User**: Custom user model with shop/professional/agent details
- **Role & Permission**: Role-based access control
- **ShopType, Service, ProfessionalSkill, Profession, Amenity**: Master data
- **Job**: Chair/job listings
- **RealEstate**: Property listings
- **Ticket & TicketCategory**: Support tickets
- **FAQ, Page, EmailTemplate**: Content management
- **Favorite**: User favorites
- **Plan**: Subscription plans

## Features

- JWT Authentication with refresh tokens
- Session-based authentication for admin panel
- Role-based permissions
- File uploads to AWS S3
- PostgreSQL database
- Redis for caching (optional)
- CORS support
- Admin panel with full CRUD operations

## Environment Variables

See `.env.example` for required environment variables.

## License

ISC

