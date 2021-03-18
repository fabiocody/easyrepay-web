from django.db import models
from django.contrib.auth.models import User


class Transaction(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    person = models.CharField(max_length=128)
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
