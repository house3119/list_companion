from django.contrib import admin
from .models import User, List, List_item, Log_entry


# Register your models here.
class ListAdmin(admin.ModelAdmin):
    filter_horizontal = ("list_additional_users",)


admin.site.register(User)
admin.site.register(List, ListAdmin)
admin.site.register(List_item)
admin.site.register(Log_entry)
