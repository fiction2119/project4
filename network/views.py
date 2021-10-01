import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http.response import Http404
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse


from .models import User, Post, Interact, Follow


def index(request):

    # Authenticated users view their index page
    if request.user.is_authenticated:
        return render(request, "network/network.html")

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)

        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
@login_required
def post(request):

    # Composing a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Getting necessary data to save new post
    data = json.loads(request.body)
    body = data.get("body", "")
    user = User.objects.get(username=request.user.username)
    post = Post(user=user, body=body)
    post.save()

    return JsonResponse({"message": "Post sent successfully."}, status=201)


@login_required
def all_posts(request):

    # Get and return all posts in reverse chronological order
    posts = Post.objects.all()

    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)


@csrf_exempt
@login_required
def profile(request, profile_str):

    user = User.objects.get(username=request.user.username)
    user2 = User.objects.get(username=profile_str)
    follow = Follow(user1=user, user2=user2)

    if not Follow.objects.filter(user1=user, user2=profile):
        follow.save()

    if request.method == 'GET':
        # Get profile data and serialize it
        return JsonResponse(user2.serialize())

    elif request.method == 'PUT':
        data = json.loads(request.body)
        if data.get('follow') is not None:
            follow.follow = data['follow']
        follow.save()
        return HttpResponse(status=204)
    else:
        return JsonResponse({"error": "GET or PUT request required"}, status=400)


@login_required
def profile_posts(request, profile_str):

    # Get posts from current profile and return them serialized
    user = User.objects.get(username=profile_str)
    user_posts = Post.objects.filter(user=user)

    return JsonResponse([post.serialize() for post in user_posts], safe=False)


@csrf_exempt
@login_required
def follow(request, profile_str):

    follow = Follow.objects.filter(
        user1=request.user.username, user2=profile_str)

    if not follow:
        follow = Follow(user1=request.user.username, user2=profile_str)
        follow.save()

    if len(follow) == 1:
        follow = Follow.objects.get(
            user1=request.user.username, user2=profile_str)
        print(follow.follow)
    else:
        return JsonResponse({"error": "The result must be 1"}, status=400)

    return HttpResponse(status=204)
