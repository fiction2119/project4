from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):  # AbstractUser is customizable
    username = models.CharField(max_length=200, unique=True, null=True)
    bio = models.TextField(null=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def serialize(self):
        return {
            "username": self.username,
            "bio": self.bio,
        }


class Follow(models.Model):
    follower = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="follower", default=None)
    following = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="following", default=None)
    is_following = models.BooleanField(default=False)

    class Meta:
        unique_together = (
            ('follower', 'following'),
        )

    def serialize(self):
        return {
            "follower": self.follower.username,
            "following": self.following.username,
            "is_following": self.is_following,
        }


class Post(models.Model):
    author = models.ForeignKey(
        "User", on_delete=models.CASCADE, default=None)
    body = models.TextField()
    created = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']

    def serialize(self):
        return {
            "username": self.author.username,
            "body": self.body,
            "created": self.created
        }

    def __str__(self):
        return self.body


class Like(models.Model):
    post = models.ForeignKey(
        "Post", on_delete=models.CASCADE)
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE)
    like = models.BooleanField(default=False)

    def serialize(self):
        return {
            "post_id": self.post.id,
            "user": self.user.username,
            "like": self.like,
        }
