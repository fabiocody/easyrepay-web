from rest_framework import serializers
from .models import Transaction, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'owner', 'other', 'type', 'amount', 'description', 'completed', 'dateTime')
