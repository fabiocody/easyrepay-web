from functools import reduce

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .dtos import PersonDto
from .models import Person, Transaction
from .serializers import TransactionSerializer, UserSerializer, PersonDtoSerializer


class UserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class PeopleView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        people = Person.objects.filter(user=request.user)
        transactions = Transaction.objects.filter(person__user=request.user)
        people_dtos = list()
        for person in people:
            p_transactions = list(filter(lambda t: t.person == person, transactions))
            count = len(p_transactions)
            total = reduce(lambda a, b: a+b, map(lambda t: t.signed_amount, p_transactions), 0)
            people_dtos.append(PersonDto(person.name, count, total))
        return Response(PersonDtoSerializer(people_dtos, many=True).data)


class TransactionsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(person__user=request.user)
        return Response(TransactionSerializer(transactions, many=True).data)

