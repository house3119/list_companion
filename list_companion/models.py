from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):

    def __str__(self):
        return f"{self.username}"


class List(models.Model):
    list_name = models.CharField(max_length=30)
    list_description = models.CharField(max_length=60, blank=True)
    list_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lists")
    list_additional_users = models.ManyToManyField(User, blank=True, related_name="foreign_lists")
    list_date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.list_name} (owner: {self.list_owner})"


class List_item(models.Model):
    list_item_name = models.CharField(max_length=30)
    list_item_related_list = models.ForeignKey(List, on_delete=models.CASCADE, related_name="list_items")
    list_item_done = models.BooleanField(default=False)
    list_item_date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.list_item_name} (list: {self.list_item_related_list})"
    

class Log_entry(models.Model):
    action_category = (
        ("ADD", "added item"),
        ("DEL", "deleted item"),
        ("DON", "marked as done"),
        ("UND", "marked as undone"),
    )
    log_action = models.CharField(choices=action_category, max_length=3)
    log_list = models.ForeignKey(List, on_delete=models.CASCADE, related_name="list_logs")
    log_item = models.CharField(max_length=30)
    log_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_logs")
    log_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Action: {self.log_action}, Item: {self.log_item}, List: {self.log_list.list_name}, User: {self.log_user.username}"

