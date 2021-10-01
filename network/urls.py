
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("post", views.post, name="post"),
    path("posts", views.all_posts, name="all_posts"),
    path("profile/<str:profile_str>", views.profile, name="profile"),
    path("profile/posts/<str:profile_str>",
         views.profile_posts, name="profile_posts"),
    path("profile/follow<str:profile_str>", views.follow, name="follow"),

]
