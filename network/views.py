import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http.response import Http404
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse


from .models import User, Post, Like, Follow


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
def compose(request):

    # Composing a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Transforming request.body into usable json data
    data = json.loads(request.body)

    # Getting the value correspondent to body, which will be the content of the post
    body = data.get("body", "")

    user = User.objects.get(username=request.user.username)
    post = Post(author=user, body=body)

    post.save()

    return JsonResponse({"message": "Post sent successfully."}, status=201)


@login_required
def allPosts(request):

    # Get and return all posts in reverse chronological order
    posts = Post.objects.all()

    return JsonResponse([post.serialize() for post in posts], safe=False)


@csrf_exempt
@login_required
def userProfile(request, username):

    if request.method == 'GET':
        # Get profile data and serialize it
        profileUser = User.objects.get(username=username)
        return JsonResponse(profileUser.serialize())
    else:
        return JsonResponse({"error": "GET request required"}, status=400)


@login_required
def profilePosts(request, username):

    # Get profile posts and serialize them
    user = User.objects.get(username=username)
    user_posts = Post.objects.filter(author=user)

    return JsonResponse([post.serialize() for post in user_posts], safe=False)


@csrf_exempt
@login_required
def follow(request, username):

    try:
        loggedUser = User.objects.get(username=request.user)
        profileUser = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=204)

    if request.user != username:
        follow, created = Follow.objects.get_or_create(
            follower=loggedUser, following=profileUser)

    if request.method == "GET":
        return JsonResponse(follow.serialize())

    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("is_following") is not None:
            follow.is_following = data["is_following"]
        follow.save()
        return HttpResponse(status=204)

    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)
