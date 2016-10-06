from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

class LoggedInMixin(object):

	@method_decorator(login_required)
	def dispatch(self, *args, **kwargs):
		return super(LoggedInMixin, self).dispatch(*args, **kwargs)



class SerializeUserMixin(object):
	
	def user_to_json(self, user):
		return {
			'id' : user.pk,
			'username' : user.username,
			'first_name' : user.first_name,
			'last_name' : user.last_name,
			'email' : user.email,
			'created_at' : user.date_joined,
		}
	
	
	def admin_to_json(self, admin):
		return {}