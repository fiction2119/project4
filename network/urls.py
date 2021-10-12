
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("post", views.post, name="post"),
    path("posts", views.allPosts, name="all-posts"),
    path("profile/<str:pk>", views.userProfile, name="profile"),
    path("profile/posts/<str:pk>",
         views.profilePosts, name="profile-posts"),

]
