from django.urls import path
from rest_framework_simplejwt.views import token_obtain_pair, token_refresh, token_verify

from . import views

urlpatterns = [
    path('transactions', views.TransactionsView.as_view()),
    path('me', views.MyUserView.as_view()),
    path('token', token_obtain_pair),
    path('token/refresh', token_refresh),
    path('token/verify', token_verify),
]
