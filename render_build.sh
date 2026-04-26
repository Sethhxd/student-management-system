#!/bin/bash
# Build script for Render

echo "Running migrations..."
python manage.py migrate --noinput

echo "Creating superuser if needed..."
python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser('admin', 'admin@school.com', 'Admin123!')
    print('Superuser created')
else:
    print('Superuser already exists')
"

echo "Build complete"