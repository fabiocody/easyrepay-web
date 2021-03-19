from functools import reduce

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .dtos import PersonDto
from .models import Person, Transaction
from .serializers import TransactionSerializer, UserSerializer, PersonDtoSerializer, AddPersonSerializer


class UserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return the current user"""
        return Response(UserSerializer(request.user).data)


class PeopleView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return the list of PersonDtos associated to the current user"""
        people = Person.objects.filter(user=request.user)
        transactions = Transaction.objects.filter(person__user=request.user)
        people_dtos = list()
        for person in people:
            p_transactions = list(filter(lambda t: t.person == person, transactions))
            count = len(p_transactions)
            total = reduce(lambda a, b: a+b, map(lambda t: t.signed_amount, p_transactions), 0)
            people_dtos.append(PersonDto(person.id, person.name, count, total))
        return Response(PersonDtoSerializer(people_dtos, many=True).data)

    def post(self, request):
        """Add a new person"""
        serializer = AddPersonSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.data['name']
            homonyms = Person.objects.filter(user=request.user, name=name)
            if len(homonyms) == 0:
                person = Person(name=name, user=request.user)
                person.save()
                return Response()
            return Response(status=status.HTTP_409_CONFLICT)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class PersonView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, person_id):
        """Return the requested person"""
        person = Person.objects.filter(id=person_id, user=request.user).first()
        if person:
            return Response(PersonDtoSerializer(PersonDto(person.id, person.name, 0, 0)).data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, person_id):
        """Update the requested person"""
        serializer = AddPersonSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.data['name']
            person = Person.objects.filter(id=person_id, user=request.user).first()
            if person:
                person.name = name
                person.save()
                return Response()
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, person_id):
        person = Person.objects.filter(id=person_id, user=request.user).first()
        if person:
            person.delete()
            return Response()
        return Response(status=status.HTTP_404_NOT_FOUND)


class TransactionsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, person_id):
        """Return the transactions related to the provided person"""
        transactions = Transaction.objects.filter(person__id=person_id).order_by('dateTime')
        return Response(TransactionSerializer(transactions, many=True).data)
