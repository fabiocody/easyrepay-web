from django.contrib import admin
from api.models import Person, Transaction


class PersonAdmin(admin.ModelAdmin):
    model = Person
    list_display = ('id', 'name', 'user')


class TransactionAdmin(admin.ModelAdmin):
    model = Transaction
    list_display = list(map(lambda f: f.name, Transaction._meta.get_fields()))


admin.site.register(Person, PersonAdmin)
admin.site.register(Transaction, TransactionAdmin)
