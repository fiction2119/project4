from django.contrib import admin

from .models import Post, Follow, Interact  # , Like

# Register your models here.
admin.site.register(Interact)
admin.site.register(Post)
admin.site.register(Follow)
# admin.site.register(Like)
