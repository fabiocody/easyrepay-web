from django.db import models
from django.contrib.auth.models import User


class Login(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=1024)
    refresh_token = models.CharField(max_length=1024)


class Transaction(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    other = models.CharField(max_length=128)
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
