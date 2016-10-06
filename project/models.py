import json

from django.db import models
from django.contrib.auth.models import User
from makethis.tags.models import Tag

from makethis.mixins import SerializeUserMixin


class Project(SerializeUserMixin, models.Model):
	title = models.CharField(max_length=200)
	description = models.TextField()
	explanation = models.TextField()
	image = models.ImageField(blank=True)
	views = models.IntegerField(default=0, blank=True)
	like = models.ManyToManyField(User, related_name='project_likes', blank=True)
	star = models.ManyToManyField(User, related_name='project_stars', blank=True)
	tags = models.ManyToManyField(Tag, related_name='tagged_projects', blank=True)
	user = models.ForeignKey(User, related_name='projects')
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)


	def __unicode__(self):
		return self.title


	@property
	def detail_url(self):
		return '/project/' + self.pk


	@property
	def likes(self):
		return self.like.count()


	def liked(self, user):
		return self.like.filter(pk=user.pk).exists()


	@property
	def stars(self):
		return self.star.count()


	def starred(self, user):
		return self.star.filter(pk=user.pk).exists()


	def json(self, user=None):
		response = {}
		response['id'] = self.pk
		response['title'] = self.title
		response['description'] = self.description
		response['explanation'] = self.explanation
		if self.image:
			response['image'] = self.image.url
		response['views'] = self.views
		response['likes'] = self.likes
		response['liked'] = False
		response['stars'] = self.stars
		response['starred'] = False
		response['owner'] = self.user.email
		response['tags'] = list(self.tags.all())
		response['design_count'] = self.designs.count()
		response['code_count'] = self.code.count()
		response['comment_count'] = 0
		response['comments'] = []
		response['created_at'] = self.created_at.isoformat()
		response['updated_at'] = self.updated_at.isoformat()

		if user is not None:
			response['liked'] = self.liked(user)
			response['starred'] = self.starred(user)
			response['user'] = self.user_to_json(user)

		return response


	def json_string(self, user=None):
		return json.dumps(self.json(user))


	def detail_json(self, user=None):
		response = self.json()

		response['designs'] = [design.json_string(user) for design in self.designs.all().order_by("-created_at")[0:5]]
		response['code'] = [code.json_string(user) for code in self.code.all().order_by("-created_at")[0:5]]

		return response


	def detail_json_string(self, user=None):
		return json.dumps(self.detail_json(user))
