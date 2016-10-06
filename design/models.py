from django.db import models
from django.contrib.auth.models import User
from makethis.project.models import Project
from makethis.tags.models import Tag


class Design(models.Model):
	title = models.CharField(max_length=200)
	description = models.TextField()
	image = models.ImageField(blank=True)
	comp_file = models.FileField(blank=True)
	project = models.ForeignKey(Project, related_name='designs')
	views = models.IntegerField(default=0, blank=True)
	like = models.ManyToManyField(User, related_name='design_likes', blank=True)
	star = models.ManyToManyField(User, related_name='design_stars', blank=True)
	tag = models.ManyToManyField(Tag, related_name='tagged_designs', blank=True)
	user = models.ForeignKey(User, related_name='designs')
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)


	def __unicode__(self):
		return self.title


	@property
	def detail_url(self):
		return '/design/' + self.pk


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
		response['image'] = self.image.url
		response['views'] = self.views
		response['likes'] = self.likes
		response['liked'] = False
		response['stars'] = self.stars
		response['starred'] = False
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
		response['code'] = [code.json_string() for code in self.code.all().order_by("-created_at")[0:5]]
		return response


	def detail_json_string(self, user=None):
		return json.dumps(self.detail_json(user))
