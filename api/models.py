from django.db import models
from django.contrib.auth.models import User


class Person(models.Model):
    name = models.CharField(max_length=128)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Transaction(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    type = models.CharField(max_length=2, choices=[
        ('C', 'CREDIT'),
        ('D', 'DEBT'),
        ('SC', 'SETTLE_CREDIT'),
        ('SD', 'SETTLE_DEBT')
    ])
    amount = models.FloatField()
    description = models.TextField()
    completed = models.BooleanField()
    dateTime = models.DateTimeField()

    @property
    def signed_amount(self):
        return self.amount if self.type in ['C', 'SD'] else -self.amount

    def __str__(self):
        return f'Transaction(id={self.id}, person={self.person}, type={self.type}, amount={self.amount}, ' \
               f'description={self.description}, completed={self.completed}, dateTime={self.dateTime})'
