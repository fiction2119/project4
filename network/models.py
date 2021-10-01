from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Interact(models.Model):

    username = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="interact_username")
    followers = models.IntegerField(default=0)
    following = models.IntegerField(default=0)

    def serialize(self):
        return {
            "username": self.username,
            "followers": self.followers,
            "following": self.following,
        }


class Post(models.Model):
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="post")
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now=True)
    likes = models.IntegerField(default=0)

    def serialize(self):
        return {
            "username": self.user,
            "body": self.body,
            "timestamp": self.timestamp,
            "likes": self.likes,
        }


class Follow(models.Model):

    user1 = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="follow_user1")
    user2 = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="follow_user2")
    follow = models.BooleanField(default=False)

    def serialize(self):
        return {
            "id": self.id,
            "user1": self.user1,
            "user2": self.user2,
            "follow": self.follow,
        }


'''
class Like(models.Model):
    post_id = models.ForeignKey(
        "Post", on_delete=models.CASCADE, related_name="like", primary_key=True)
    user1 = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="like_user1")
    user2 = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="like_user2")
    like = models.BooleanField(default=False)

    def serialize(self):
        return {
            "post_id": self.post_id,
            "user1": self.user1,
            "user2": self.user2,
            "like": self.like,
        }
'''
