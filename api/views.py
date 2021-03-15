from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Transaction, User
from .serializers import TransactionSerializer, UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('id')
    serializer_class = TransactionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
