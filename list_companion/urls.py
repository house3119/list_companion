from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("register", views.register, name="register"),
    path("login", views.login_page, name="login"),
    path("logout", views.logout_page, name="logout"),
    path("add_list", views.add_list, name="add_list"),
    path("get_lists", views.get_lists, name="get_lists"),
    path("delete_list", views.delete_list, name="delete_list"),
    path("get_list_items/<str:id>", views.get_list_items, name="get_list_items"),
    path("add_item", views.add_item, name="add_item"),
    path("delete_item", views.delete_item, name="delete_item"),
    path("item_done", views.item_done, name="item_done"),
    path("get_users/<int:id>", views.get_users, name="get_users"),
    path("remove_user_from_list", views.remove_user_from_list, name="remove_user_from_list"),
    path("add_user", views.add_user, name="add_user"),
    path("get_logs/<int:id>", views.get_logs, name="get_logs"),
    path("unsub", views.unsub, name="unsub"),
    path("account", views.account, name="account"),
    path("change_password", views.change_password, name="change_password"),
    path("change_email", views.change_email, name="change_email"),
    path("delete_account", views.delete_account, name="delete_account")
]
