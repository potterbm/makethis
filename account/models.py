import json

from django.db import models
from django.contrib.auth.models import User

from makethis.project.models import Project
from makethis.design.models import Design
from makethis.code.models import Code


class Account(models.Model):
	user = models.OneToOneField(User, primary_key=True)
	user_url = models.CharField(max_length=20, blank=True, null=True)
	avatar = models.ImageField(blank=True)
	designer = models.BooleanField(blank=True, default=False)
	developer = models.BooleanField(blank=True, default=False)
	birthday = models.DateField(blank=True)
	codepen_author = models.CharField(max_length=200, blank=True)
	follows = models.ManyToManyField("self", symmetrical=False, related_name="followers")

	def __unicode__(self):
		return self.user.get_full_name()


	@property
	def display_name(self):
		return self.user.first_name or self.user.username or self.user.email

	@property
	def url(self):
		if self.user_url:
			return '/user/' + self.user_url
		elif '@' not in self.user.username:
			return '/user/' + self.user.username
		else:
			return '/user/' + self.user.pk


	def json(self):
		response = {}
		response['authenticated'] = bool(self.user.is_authenticated())
		response['first_name'] = str(self.user.first_name)
		response['last_name'] = str(self.user.last_name)
		response['email'] = self.user.email
		response['user_url'] = self.user_url
		response['avatar'] = str(self.avatar)
		response['birthday'] = str(self.birthday)
		response['codepen_author'] = self.codepen_author

		if self.user.first_name:
			response['display_name'] = self.user.first_name
		elif self.user.email:
			response['display_name'] = self.user.email
		elif self.user.username:
			response['display_name'] = self.user.username
		else:
			response['display_name'] = "Anonymous"

		return response


	def json_string(self):
		return json.dumps(self.json())
