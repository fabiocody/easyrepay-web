from rest_framework import serializers
from .models import Transaction, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'last_login')


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class PersonDtoSerializer(serializers.Serializer):
    name = serializers.CharField()
    count = serializers.IntegerField()
    total = serializers.FloatField()
