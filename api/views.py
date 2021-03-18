from functools import reduce

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .dtos import Person
from .models import Transaction
from .serializers import TransactionSerializer, UserSerializer, PersonSerializer


class MyUserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class MyPeopleView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(owner=request.user)
        names = set(map(lambda t: t.person, transactions))
        people = list()
        for name in names:
            p_transactions = list(filter(lambda t: t.person == name, transactions))
            count = len(p_transactions)
            total = reduce(lambda a, b: a+b, map(lambda t: t.signed_amount, p_transactions))
            people.append(Person(name, count, total))
        return Response(PersonSerializer(people, many=True).data)


class TransactionsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(owner=request.user)
        return Response(TransactionSerializer(transactions, many=True).data)

