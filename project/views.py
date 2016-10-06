from django.db.models import F

from django.views.generic import DetailView
from django.views.generic.edit import FormView

from makethis.mixins import LoggedInMixin

from .models import Project
from .forms import ProjectForm


class ProjectDetailView(DetailView):
	context_object_name = "project"
	model = Project
	
	def get(self, request, pk=None, **kwargs):
		
		if not pk is None:
			Project.objects.filter(pk=pk).update(views=F('views') + 1)
		
		return super(ProjectDetailView, self).get(self, request, pk=pk, **kwargs)
	


class CreateProject(LoggedInMixin, FormView):
	template_name = 'project/project_edit.html'
	form_class = ProjectForm
	success_url = '/project/'
	
	def form_valid(self, form):
		return super(CreateProject, self).form_valid(form)



class EditProject(LoggedInMixin, FormView):
	template_name = 'project/project_edit.html'
	form_class = ProjectForm
	success_url = '/project/'
	
	
	def form_valid(self, form):
		return super(EditProject, self).form_valid(form)
	