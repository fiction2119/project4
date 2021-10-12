from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):  # AbstractUser is customizable
    pass


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
            "created": self.created,
            "likes": self.likes,
        }

    def __str__(self):
        return self.body


class Follow(models.Model):
    follower = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="user1", default=None)
    following = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="user2", default=None)

    class Meta:
        unique_together = (
            ('follower', 'following'),
        )

    def serialize(self):
        return {
            "follow_id": self.id,
            "follower": self.follower.username,
            "following": self.following.username,
        }


class Like(models.Model):
    post = models.ForeignKey(
        "Post", on_delete=models.CASCADE)
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE)
    like = models.BooleanField(default=False)

    def serialize(self):
        return {
            "post_id": self.post.id,
            "user": self.user,
            "like": self.like,
        }
