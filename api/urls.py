from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import token_obtain_pair, token_refresh, token_verify

from . import views

router = routers.DefaultRouter()
router.register(r'transactions', views.TransactionViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token', token_obtain_pair),
    path('token/refresh', token_refresh),
    path('token/verify', token_verify),
]
