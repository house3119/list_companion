import json
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .forms import login_form, register_form
from .models import User, List, List_item


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
        lists = list(List.objects.filter(list_owner=user).all().values())

        return JsonResponse({
            "Message": "Success",
            "Lists": lists,
            },
            status=200)
    else:
        return JsonResponse({"Message":"Only GET requests accepted"}, status=500)
    

def delete_list(request):
    if request.method == "POST":
        data = json.loads(request.body)
        list_to_be_deleted_id = data["list_to_be_deleted"]
        list_owner = User.objects.get(username=request.user)
        try:
            remove = List.objects.get(id=list_to_be_deleted_id, list_owner=list_owner)
            remove.delete()
            return JsonResponse({"Message":"Success"}, status=200)
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
                    "List_items": list_items
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
            return JsonResponse({"Message":"Success"}, status=200)
        else:
            return JsonResponse({"Message":"Wrong user"}, status=404)      
    else:
        return JsonResponse({"Message":"Not a POST request"}, status=403)


def delete_item(request):
    if request.method == "POST":
        data = json.loads(request.body)
        item_id = data["item_to_be_deleted"]

        try:
            List_item.objects.get(id=item_id).delete()
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

        try:
            if done == True:
                item.list_item_done = True
                item.save()
                return JsonResponse({"Message":"Success"}, status=200)
            else:
                item.list_item_done = False
                item.save()
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
    

def get_user_info(request, id):
    try:
        user = User.objects.get(username=request.user)
        owner = List.objects.get(id=id).list_owner

        if user == owner:
            return JsonResponse({"Owner": True}, status=200)
        else:
            return JsonResponse({"Owner": False}, status=200)
    except:
        return JsonResponse({"Message": "Error"}, status=404)
    

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

