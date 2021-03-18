from django.contrib import admin
from api.models import Transaction


class TransactionAdmin(admin.ModelAdmin):
    model = Transaction
    list_display = list(map(lambda f: f.name, Transaction._meta.get_fields()))


admin.site.register(Transaction, TransactionAdmin)
