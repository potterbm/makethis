from django.db import models

from django.contrib.auth.models import User

from makethis.project.models import Project
from makethis.design.models import Design
from makethis.code.models import Code

class Notifications(models.Model):
	LIKE = 1
	STAR = 2
	FOLLOW = 3
	COMMENT = 4
	MENTION = 5
	
	ACTIVITY_TYPES = [(LIKE, 'Liked'), (STAR, 'Starred'), (FOLLOW, 'Followed'), (COMMENT, 'Commented'), (MENTION, 'Mentioned')]
	
	ACTIVITY_MESSAGES = { LIKE: 'Someone liked your {thing}', FOLLOW: '{person} followed you', COMMENT: '{person} commented on your {thing}', MENTION: '{person} mentioned you in a comment on {thing}' }
	
	project = models.ForeignKey(Project, blank=True)
	design = models.ForeignKey(Design, blank=True)
	code = models.ForeignKey(Code, blank=True)
	person = models.ForeignKey(User, blank=True, related_name='notification_subjects')
	viewed = models.BooleanField(default=False)
	activity_type = models.IntegerField(choices=ACTIVITY_TYPES)
	user = models.ForeignKey(User, related_name='notifications')
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	
	
	@property
	def html(self):
		message = self.ACTIVITY_MESSAGES[self.activity_type]
		
		if self.project is not None:
			message = message.format(thing='<a href="' + self.project.detail_url + '">project</a>')
		elif self.design is not None:
			message = message.format(thing='<a href="' + self.design.detail_url + '">design</a>')
		elif self.code is not None:
			message = message.format(thing='<a href="' + self.code.detail_url + '">code</a>')
		
		if self.person is not None:
			message = message.format(person='<a href="' + self.person.account.url + '">' + self.person.get_full_name() + '</a>')
		
		return message



class Comment(models.Model):
	text = models.TextField()
	user = models.ForeignKey(User, related_name='comments')
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)