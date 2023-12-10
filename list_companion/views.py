import json
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .forms import login_form, register_form, change_password_form, change_email_form, delete_account_form
from .models import User, List, List_item, Log_entry


# Default view. Redirect to login, if user is not logged in.
def index(request):
    if request.user.is_authenticated:
        return render(request, "list_companion/index.html")
    else:
        return HttpResponseRedirect(reverse("login"))


# View to render register form.
def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password1"]
        confirm_password = request.POST["password2"]

        # Checking validity of inputs
        if password != confirm_password:
            return render(request, "list_companion/register.html", {
            "register_form": register_form,
            "message": "Passwords don't match."
        })
        if User.objects.filter(username=username).exists():
            return render(request, "list_companion/register.html", {
            "register_form": register_form,
            "message": "User with this username already exist."
        })
        if User.objects.filter(email=email).exists():
            return render(request, "list_companion/register.html", {
            "register_form": register_form,
            "message": "User with this email address already exist."
        })

        # Try to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except:
            return render(request, "list_companion/register.html", {
            "register_form": register_form,
            "message": "Unexpected error. Please try again."
        })

        # Creating new user succesful
        return render(request, "list_companion/register.html", {
            "register_form": register_form,
            "message": "Registeration successful. You can now log in."
        })

    else:
        return render(request, "list_companion/register.html", {
            "register_form": register_form
        })


# Login view. Used to log user in if request method is post and renders login form if method is get.
def login_page(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "list_companion/login.html", {
                "login_form": login_form,
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "list_companion/login.html", {
            "login_form": login_form
        })
    

def logout_page(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def add_list(request):
    if request.method == "POST":
        data = json.loads(request.body)
        new_list_name = data["new_list_name"]
        new_list_description = data["new_list_description"]
        new_list_owner = User.objects.get(username=request.user)

        if new_list_name == "":
            return JsonResponse({"Message":"Error"}, status=500)

        try:
            new_list = List.objects.create(list_name=new_list_name, list_owner=new_list_owner, list_description=new_list_description)
            new_list.save()
            return JsonResponse({"Message":"Success"}, status=200)
        except:
            return JsonResponse({"Message":"Error"}, status=500)
    else:
        return JsonResponse({"Message":"Not a POST request"}, status=403)


def get_lists(request):
    if request.method == "GET":
        user = User.objects.get(username=request.user)

        # Add additional users and owner to json to be returned
        lists = List.objects.filter(list_owner=user).all()
        lists_json = list(lists.values())

        helper = 0
        for i in lists:
            holder = []
            for j in i.list_additional_users.all():
                holder.append(j.username)
            
            lists_json[helper]["additional_users"] = holder
            lists_json[helper]["owner_username"] = user.username
            helper += 1


        shared_lists = user.foreign_lists.all()
        shared_lists_json = list(shared_lists.values())

        helper = 0
        for i in shared_lists:
            holder = []
            for j in i.list_additional_users.all():
                holder.append(j.username)
            
            shared_lists_json[helper]["additional_users"] = holder
            shared_lists_json[helper]["owner_username"] = User.objects.get(id=shared_lists_json[helper]["list_owner_id"]).username
            helper += 1
        

        return JsonResponse({
            "Message": "Success",
            "Lists": lists_json,
            "Foreign_lists": shared_lists_json
            },
            status=200)
    else:
        return JsonResponse({"Message":"Only GET requests accepted"}, status=500)
    

def delete_list(request):
    if request.method == "POST":
        data = json.loads(request.body)
        list_to_be_deleted_id = data["list_to_be_deleted"]
        list_owner = List.objects.get(id=list_to_be_deleted_id).list_owner
        user = User.objects.get(username=request.user)

        try:
            if user == list_owner:
                remove = List.objects.get(id=list_to_be_deleted_id, list_owner=list_owner)
                remove.delete()
                return JsonResponse({"Message":"Success"}, status=200)
            else:
                return JsonResponse({"Message": "Forbidden"}, status=403)
        except:
            return JsonResponse({"Message":"Something went wrong"}, status=500)  
    else:
        return JsonResponse({"Message":"Not a POST request"}, status=403)
    

def get_list_items(request, id):
    if request.method == "GET":
        try:
            user = User.objects.get(username=request.user)
            related_list = List.objects.get(id=id)
            if related_list.list_owner == user:
                list_items = list(List_item.objects.filter(list_item_related_list=related_list).all().values().order_by("list_item_done"))
                return JsonResponse({
                    "Message":"Success",
                    "List_items": list_items,
                    "List_name": related_list.list_name
                    }
                    , status=200)
            elif related_list in user.foreign_lists.all():
                list_items = list(List_item.objects.filter(list_item_related_list=related_list).all().values().order_by("list_item_done"))
                return JsonResponse({
                    "Message":"Success",
                    "List_items": list_items,
                    "List_name": related_list.list_name
                    }
                    , status=200)
            else:
                return JsonResponse({"Message":"Wrong user"}, status=404)
        except:
            return JsonResponse({"Message":"Error"}, status=404)
    else:
        return JsonResponse({"Message":"Not a GET request"}, status=403)
    

def add_item(request):
    if request.method == "POST":
        data = json.loads(request.body)
        new_item_name = data["new_item"]
        list_id = data["list_id"]

        user = User.objects.get(username=request.user)
        related_list = List.objects.get(id=list_id)

        if user == related_list.list_owner:
            new_item = List_item.objects.create(list_item_name=new_item_name, list_item_related_list=related_list)
            new_item.save()

            log_entry = Log_entry.objects.create(log_action="ADD", log_list=related_list, log_item=new_item.list_item_name, log_user=user)
            log_entry.save()

            return JsonResponse({"Message":"Success"}, status=200)
        elif related_list in user.foreign_lists.all():
            new_item = List_item.objects.create(list_item_name=new_item_name, list_item_related_list=related_list)
            new_item.save()

            log_entry = Log_entry.objects.create(log_action="ADD", log_list=related_list, log_item=new_item.list_item_name, log_user=user)
            log_entry.save()

            return JsonResponse({"Message":"Success"}, status=200)
        else:
            return JsonResponse({"Message":"Wrong user"}, status=404)      
    else:
        return JsonResponse({"Message":"Not a POST request"}, status=403)


def delete_item(request):
    if request.method == "POST":
        data = json.loads(request.body)
        item_id = data["item_to_be_deleted"]
        user = User.objects.get(username=request.user)

        try:
            item_to_be_deleted = List_item.objects.get(id=item_id)
            related_list = item_to_be_deleted.list_item_related_list

            log_entry = Log_entry.objects.create(log_action="DEL", log_list=related_list, log_item=item_to_be_deleted.list_item_name, log_user=user)
            log_entry.save()

            item_to_be_deleted.delete()

            return JsonResponse({"Message":"Success"}, status=200)   
        except:
            return JsonResponse({"Message":"Error"}, status=404) 
    else:
        return JsonResponse({"Message":"Not a POST request"}, status=403)
    

def item_done(request):
    if request.method == "POST":
        data = json.loads(request.body)
        item_id = data["item"]
        done = data["done"]
        item = List_item.objects.get(id=item_id)
        user = User.objects.get(username=request.user)

        try:
            if done == True:
                item.list_item_done = True
                item.save()

                log_entry = Log_entry.objects.create(log_action="DON", log_list=item.list_item_related_list, log_item=item.list_item_name, log_user=user)
                log_entry.save()

                return JsonResponse({"Message":"Success"}, status=200)
            else:
                item.list_item_done = False
                item.save()

                log_entry = Log_entry.objects.create(log_action="UND", log_list=item.list_item_related_list, log_item=item.list_item_name, log_user=user)
                log_entry.save()

                return JsonResponse({"Message":"Success"}, status=200)            
        except:
            return JsonResponse({"Message":"Error"}, status=404) 
    else:
        return JsonResponse({"Message":"Not a POST request"}, status=403)
    

def get_users(request, id):
    user = User.objects.get(username=request.user)
    owner = List.objects.get(id=id).list_owner
    additional_users = list(List.objects.get(id=id).list_additional_users.all())
    
    # Check logged in user is list owner or added as additional user
    if user == owner or user in additional_users:
        user_holder = []
        for i in additional_users:
            user_holder.append(i.username)

        return JsonResponse({
            "owner": owner.username,
            "additional_users": user_holder,
            "logged_user": user.username
        },
        status=200)
    else:
        return JsonResponse({
            "Message": "Forbidden"
        },
        status=403)
    

def remove_user_from_list(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = User.objects.get(username=request.user)
        owner = List.objects.get(id=data["list_id"]).list_owner
        user_to_be_removed = User.objects.get(username=data["user_to_be_removed"])

        # Check that logged in user is the list owner
        if user == owner:
            List.objects.get(id=data["list_id"]).list_additional_users.remove(user_to_be_removed)
            return JsonResponse({"Message": "Success"}, status=200)
        else:
            return JsonResponse({"Message": "Forbidden"}, status=403)

    else:
        return JsonResponse({"Message": "Only POST allowed"}, status=403)
    

def add_user(request):
    try:
        data = json.loads(request.body)
        user = User.objects.get(username=request.user)
        list1 = List.objects.get(id=data["list"])
        owner = list1.list_owner
        list_followers = list1.list_additional_users.all()

        if not user == owner:
            return JsonResponse ({
                "Message": "Forbidden",
                "Success": True
            })

        try:
            user_to_be_added = User.objects.get(username=data["user_to_be_added"])
        except:
            return JsonResponse({
                "Message": "User not found",
                "Success": False
            })


        if user_to_be_added == owner:
            return JsonResponse({
                "Message": "Already in users",
                "Success": False
            })
        elif user_to_be_added in list_followers:
            return JsonResponse({
                "Message": "Already in users",
                "Success": False
            })
        else:
            list1.list_additional_users.add(user_to_be_added)
            list1.save()
            return JsonResponse({
                "Message": "User added",
                "Success": True
            })

    except:
        return JsonResponse({"Message": "Error"}, status=500)


def get_logs(request, id):
    try:
        user = User.objects.get(username=request.user)
        related_list = List.objects.get(id=id)
        followers = related_list.list_additional_users
        owner = related_list.list_owner

        if user == owner or user in followers:
            log = list(related_list.list_logs.all().values().order_by("-log_date"))
            for message in log:
                message["username"] = User.objects.get(id=message["log_user_id"]).username
                message["log_date"] = message["log_date"].strftime("%d/%m/%Y, %H:%M")
            return JsonResponse({
                "Message": "Success",
                "Log": log,
            },
            status=200)
        
        else:
            return JsonResponse({
                "Message": "Forbidden"
            },
            status=403)
        
    except:
        return JsonResponse({
            "Message": "Error"
            },
            status=500)


def unsub(request):
    if request.method == "POST":
        try:
            user = User.objects.get(username=request.user)
            data = json.loads(request.body)
            list_to_unsub = List.objects.get(id=data["list_to_unsub"]["id"])

            list_to_unsub.list_additional_users.remove(user)
            list_to_unsub.save()

            return JsonResponse({"Message": "Success"}, status=200)
        except:
            return JsonResponse({"Message": "Error"}, status=500)
    else:
        return JsonResponse({"Message": "Only POST requests"}, status=403)
    

def account(request):
    if request.user.is_authenticated:
        return render(request, "list_companion/account.html", {
            "account": User.objects.get(username=request.user),
            "change_password_form": change_password_form,
            "change_email_form": change_email_form,
            "delete_account_form": delete_account_form
        })
    else:
        return HttpResponseRedirect(reverse("login"))
    

def change_password(request):
    if request.method == "POST":
        old_password = request.POST["current_password"]
        new_password = request.POST["new_password"]

        try:
            user = authenticate(username=request.user, password=old_password)
            if user != None:
                user.set_password(new_password)
                user.save()
                return render(request, "list_companion/account.html", {
                        "account": User.objects.get(username=request.user),
                        "change_password_form": change_password_form,
                        "change_email_form": change_email_form,
                        "delete_account_form": delete_account_form,
                        "message": "Password change succesful"
                })
            else:
                return render(request, "list_companion/account.html", {
                        "account": User.objects.get(username=request.user),
                        "change_password_form": change_password_form,
                        "change_email_form": change_email_form,
                        "delete_account_form": delete_account_form,
                        "message": "Wrong Password"
                })
        except:
            return render(request, "list_companion/account.html", {
                        "account": User.objects.get(username=request.user),
                        "change_password_form": change_password_form,
                        "change_email_form": change_email_form,
                        "delete_account_form": delete_account_form,
                        "message": "Unexpected Error"
            })
    else:
        return HttpResponseRedirect(reverse("account"))


def change_email(request):
    if request.method == "POST":

        password = request.POST["current_password"]
        new_email = request.POST["new_email"]

        try:
            user = authenticate(username=request.user, password=password)
            if user != None:
                user.email = new_email
                user.save()

                return render(request, "list_companion/account.html", {
                    "account": User.objects.get(username=request.user),
                    "change_password_form": change_password_form,
                    "change_email_form": change_email_form,
                    "delete_account_form": delete_account_form,
                    "message": "Email change successful"
                })
            else:
                return render(request, "list_companion/account.html", {
                    "account": User.objects.get(username=request.user),
                    "change_password_form": change_password_form,
                    "change_email_form": change_email_form,
                    "delete_account_form": delete_account_form,
                    "message": "Wrong Password"
                })
        except:
            return render(request, "list_companion/account.html", {
                "account": User.objects.get(username=request.user),
                "change_password_form": change_password_form,
                "change_email_form": change_email_form,
                "delete_account_form": delete_account_form,
                "message": "Unexpected Error"
            })

    else:
        return HttpResponseRedirect(reverse("account"))
    

def delete_account(request):
    if request.method == "POST":
        password = request.POST["current_password"]
        try:
            user = authenticate(username=request.user, password=password)
            if user != None:
                user.delete()
                return HttpResponseRedirect(reverse("index"))
            else:
                return render(request, "list_companion/account.html", {
                    "account": User.objects.get(username=request.user),
                    "change_password_form": change_password_form,
                    "change_email_form": change_email_form,
                    "delete_account_form": delete_account_form,
                    "message": "Wrong Password"
                })
        except:
            return render(request, "list_companion/account.html", {
                    "account": User.objects.get(username=request.user),
                    "change_password_form": change_password_form,
                    "change_email_form": change_email_form,
                    "delete_account_form": delete_account_form,
                    "message": "Unexpected Error"
                })
    else:
        return JsonResponse({"Message": "Forbidden"},status=403)