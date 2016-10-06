from django.conf.urls import patterns, include, url

from makethis.api.views import API, LoginAPI, RegisterAPI, AccountAPI, UserAPI, ProjectAPI, DesignAPI, CodeAPI, ValidateAPI

urlpatterns = patterns('',

	## Code URLs

	url(r'project/(?P<project_id>\d+)/code/new/?', CodeAPI.as_view(endpoint='create')),
	url(r'project/(?P<project_id>\d+)/code/(?P<pk>\d+)/edit/?', CodeAPI.as_view(endpoint='edit')),
	url(r'code/(?P<pk>\d+)/detail/?', CodeAPI.as_view(endpoint='detail')),
	url(r'code/(?P<pk>\d+)/star/?', CodeAPI.as_view(endpoint='star')),
	url(r'code/(?P<pk>\d+)/like/?', CodeAPI.as_view(endpoint='like')),
	url(r'code/(?P<pk>\d+)/unlike/?', CodeAPI.as_view(endpoint='unlike')),
	url(r'code/(?P<pk>\d+)/edit/?', CodeAPI.as_view(endpoint='edit')),
	url(r'code/(?P<pk>\d+)/delete/?', CodeAPI.as_view(endpoint='delete')),
	url(r'code/list(/(?P<page>\d+))?/?', CodeAPI.as_view(endpoint='list')),


	## Design URLs

	url(r'project/(?P<project_id>\d+)/design/new/?', DesignAPI.as_view(endpoint='create')),
	url(r'project/(?P<project_id>\d+)/design/(?P<pk>\d+)/edit/?', DesignAPI.as_view(endpoint='edit')),
	url(r'design/(?P<pk>\d+)/detail/?', DesignAPI.as_view(endpoint='detail')),
	url(r'design/(?P<pk>\d+)/star/?', DesignAPI.as_view(endpoint='star')),
	url(r'design/(?P<pk>\d+)/like/?', DesignAPI.as_view(endpoint='like')),
	url(r'design/(?P<pk>\d+)/unlike/?', DesignAPI.as_view(endpoint='unlike')),
	url(r'design/(?P<pk>\d+)/edit/?', DesignAPI.as_view(endpoint='edit')),
	url(r'design/(?P<pk>\d+)/delete/?', DesignAPI.as_view(endpoint='delete')),
	url(r'design/list(/(?P<page>\d+))?/?', DesignAPI.as_view(endpoint='list')),


	## Project URLs

	url(r'project/new/?', ProjectAPI.as_view(endpoint='create')),
	url(r'project/(?P<pk>\d+)/detail/?', ProjectAPI.as_view(endpoint='detail')),
	url(r'project/(?P<pk>\d+)/star/?', ProjectAPI.as_view(endpoint='star')),
	url(r'project/(?P<pk>\d+)/like/?', ProjectAPI.as_view(endpoint='like')),
	url(r'project/(?P<pk>\d+)/unlike/?', ProjectAPI.as_view(endpoint='unlike')),
	url(r'project/(?P<pk>\d+)/edit/?', ProjectAPI.as_view(endpoint='edit')),
	url(r'project/(?P<pk>\d+)/delete/?', ProjectAPI.as_view(endpoint='delete')),
	url(r'project/list(/(?P<page>\d+))?/?', ProjectAPI.as_view(endpoint='list')),
	url(r'project/(?P<pk>\d+)/designs/?', ProjectAPI.as_view(endpoint='list_designs')),
	url(r'project/(?P<pk>\d+)/code/?', ProjectAPI.as_view(endpoint='list_code')),


	## Account URLs

	url(r'^account/new/?', RegisterAPI.as_view(endpoint='create')),
	url(r'^account/login/?', LoginAPI.as_view(endpoint='login')),
	url(r'^account/logout/?', LoginAPI.as_view(endpoint='logout')),
	url(r'^account/projects/?', AccountAPI.as_view(endpoint='list_projects')),
	url(r'^account/designs/?', AccountAPI.as_view(endpoint='list_designs')),
	url(r'^account/code/?', AccountAPI.as_view(endpoint='list_code')),


	## User URLs

	url(r'^user/(?P<user_id>\d+)/?', UserAPI.as_view(endpoint='profile')),
	url(r'^user/(?P<user_id>\d+)/profile/?', UserAPI.as_view(endpoint='profile')),
	url(r'^user/(?P<user_url>\w+)/?', UserAPI.as_view(endpoint='profile')),
	url(r'^user/(?P<user_url>\w+)/profile/?', UserAPI.as_view(endpoint='profile')),
	url(r'^user/(?P<user_id>\d+)/projects?', UserAPI.as_view(endpoint='list_projects')),
	url(r'^user/(?P<user_url>\w+)/projects?', UserAPI.as_view(endpoint='list_projects')),
	url(r'^user/(?P<user_id>\d+)/designs/?', UserAPI.as_view(endpoint='list_designs')),
	url(r'^user/(?P<user_url>\w+)/designs/?', UserAPI.as_view(endpoint='list_designs')),
	url(r'^user/(?P<user_id>\d+)/code/?', UserAPI.as_view(endpoint='list_code')),
	url(r'^user/(?P<user_url>\w+)/code/?', UserAPI.as_view(endpoint='list_code')),


	## Validation URLs

	url(r'^validate/user_url_free', ValidateAPI.as_view(endpoint='user_url_free')),


	## API documentation

	url('r^docs/?', API.as_view(endpoint='docs')),
	url('r^', API.as_view(endpoint='docs')),
)
