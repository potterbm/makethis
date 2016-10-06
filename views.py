from django.views.generic import RedirectView

from django.contrib.auth import logout



class LogoutView(RedirectView):
	permanent = False
	query_string = False
	url = '/account/login'

	def get(self, request, *args, **kwargs):
		logout(request)
		return super(LogoutView, self).get(request, *args, **kwargs)
