from django.http import JsonResponse

def api_login_required(func):
	"""
	Returns an API error instead of a 403 HTTP code
	"""
	def wrap(request, *args, **kwargs):
		
		if not request.user.is_authenticated():
			return JSONResponse({ 'status' : False, 'message' : 'Login required.' })
		
		return func(request, *args, **kwargs)
	
	wrap.__doc__=func.__doc__
	wrap.__name__=func.__name__
	
	return wrap