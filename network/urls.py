
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("compose", views.compose, name="compose"),
    path("posts", views.allPosts, name="all-posts"),
    path("profile/<str:username>", views.userProfile,
         name="profile"),
    path("profile/posts/<str:username>",
         views.profilePosts, name="profile-posts"),
    path("profile/<str:username>/follow", views.follow,
         name="follow"),
    path("following", views.followingPosts,
         name="following-posts"),
]
