from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/pets/', include('pets.urls')),
    path("api/notifications/", include("notifications.urls")),
    path("api/", include("pets.urls")),
    path("api/ai/", include("ai_matching.urls")),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
