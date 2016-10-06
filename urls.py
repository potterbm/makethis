from django.conf.urls import patterns, include, url
from django.contrib import admin

from django.contrib.auth.decorators import login_required

from django.views.generic import RedirectView, ListView, DetailView
from django.views.generic.base import TemplateView
from django.views.generic.edit import FormView

from makethis.views import LogoutView

from makethis.account.views import UserCreateView, AccountEditView

from makethis.project.views import ProjectDetailView, CreateProject, EditProject
from makethis.design.views import CreateDesign, EditDesign
from makethis.code.views import CreateCode, EditCode

from makethis.project.models import Project
from makethis.design.models import Design
from makethis.code.models import Code

admin.autodiscover()

urlpatterns = patterns('',


	## Design URLs

	#url(r'^project/(?P<project_id>\d+)/design/new', CreateDesign.as_view(), name="design_new"),
	#url(r'^design/(?P<design_id>\d+)/edit', EditDesign.as_view(), name="design_edit"),
	#url(r'^design/(?P<pk>\d+)', DetailView.as_view(context_object_name="design", model=Design), name="design_detail"),
	#url(r'^designs/?', ListView.as_view(context_object_name="designs", model=Design, queryset=Design.objects.order_by('-created_at'), paginate_by="12"), name="design_list"),


	## Code URLs

	#url(r'^project/(?P<project_id>\d+)/code/new', CreateCode.as_view(), name="code_new"),
	#url(r'^code/(?P<code_id>\d+)/edit', EditCode.as_view(), name="code_edit"),
	#url(r'^code/(?P<pk>\d+)', DetailView.as_view(context_object_name="code", model=Code), name="code_detail"),
	#url(r'^code/?', ListView.as_view(context_object_name="code", model=Code, queryset=Code.objects.order_by('-created_at'), paginate_by="12"), name="code_list"),


    ## Project URLs

    #url(r'^project/new/?', CreateProject.as_view(), name="project_new"),
    #url(r'^project/(?P<project_id>\d+)/edit/?', EditProject.as_view(), name="project_edit"),
    #url(r'^project/(?P<pk>\d+)/?', ProjectDetailView.as_view(), name="project_detail"),
    #url(r'^projects/?', ListView.as_view(context_object_name="projects", model=Project, queryset=Project.objects.order_by('-created_at'), paginate_by="12"), name="project_list"),
    #url(r'^projects/new/?', ListView.as_view(context_object_name="projects", model=Project, queryset=Project.objects.order_by('-created_at'), paginate_by="12"), name="project_list_new"),


	## Account URLs

	#url(r'^account/login/?', TemplateView.as_view(template_name="account/account_login.html")),
	#url(r'^account/logout/?', login_required(LogoutView.as_view())),
	#url(r'^account/new/?', UserCreateView.as_view()),
	#url(r'^account/edit/?', AccountEditView.as_view()),
	#url(r'^account/messages/?', login_required(TemplateView.as_view(template_name="account/account_messages.html"))),
	#url(r'^account/?', login_required(TemplateView.as_view(template_name="account/account_detail.html"))),

	# Public profile
	#url(r'^account/(?P<slug>[a-z0-9-]+)/projects', UserView.as_view()),
	#url(r'^account/(?P<slug>[a-z0-9-]+)/designs', UserView.as_view()),
	#url(r'^account/(?P<slug>[a-z0-9-]+)/code', UserView.as_view()),
	#url(r'^account/(?P<slug>[a-z0-9-]+)', UserView.as_view()),

	# Private profile
	#url(r'^account/?', PrivateUserView.as_view()),
	#url(r'^account/settings', PrivateUserView.as_view()),
	#url(r'^account/code', PrivateUserView.as_view()),
	#url(r'^account/designs', PrivateUserView.as_view()),
	#url(r'^account/projects', PrivateUserView.as_view()),



	## API URLs

	url(r'^api/', include('makethis.api.urls')),



	## Site URLs

	#url(r'^style-guide/?', TemplateView.as_view(template_name='style_guide.html')),
	#url(r'^about/?', TemplateView.as_view(template_name='site/about.html')),
	#url(r'^why\??/?', TemplateView.as_view(template_name='site/about.html')),
	#url(r'^jobs/?', TemplateView.as_view(template_name='site/jobs.html')),
	#url(r'^tos/?', TemplateView.as_view(template_name='site/tos.html')),
	#url(r'^404/?', TemplateView.as_view(template_name='404.html')),
	#url(r'^500/?', TemplateView.as_view(template_name='500.html')),
	url(r'^admin/?', include(admin.site.urls)),
	#url(r'^$', RedirectView.as_view(url="/projects/", permanent=False)),
	url(r'^', TemplateView.as_view(template_name='base.html')),
)
