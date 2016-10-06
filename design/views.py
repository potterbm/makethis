from django.db.models import F

from django.views.generic import DetailView
from django.views.generic.edit import CreateView, UpdateView

from makethis.mixins import LoggedInMixin
from makethis.project.models import Project
from .models import Design
from .forms import DesignForm


class DesignDetailView(DetailView):
	context_object_name = "design"
	model = Design
	
	def get(self, request, pk=None, project_id=None, **kwargs):
		
		if not pk is None:
			Design.objects.filter(pk=pk).update(views=F('views') + 1)
		
		return super(DesignDetailView, self).get(self, request, pk=pk, project_id=project_id, **kwargs)



class CreateDesign(LoggedInMixin, CreateView):
	template_name = 'design/design_create.html'
	form_class = DesignForm
	success_url = '/designs'
	project_id = None
	
	def get(self, request, pk=None, project_id=None, **kwargs):
		
		self.project_id = project_id
		return super(CreateDesign, self).get(self, request, pk=pk, **kwargs)
	
	
	def get_context_data(self, **kwargs):
		context = super(CreateDesign, self).get_context_data(**kwargs)
		
		if not self.project_id is None:
			context['project_id'] = self.project_id
			context['project'] = Project.objects.get(pk=self.project_id)
		
		return context
	
	
	def form_valid(self, form):
		
		if not self.project_id is None:
			design = form.save(commit=False)
			design.project = Project.objects.get(pk=project_id)
			design.save()
		
		return super(CreateDesign, self).form_valid(form)




class EditDesign(LoggedInMixin, UpdateView):
	template_name = 'design/design_edit.html'
	form_class = DesignForm
	success_url = '/designs'
	project_id = None
	
	
	def get(self, request, pk=None, project_id=None, **kwargs):
		self.project_id = project_id
		return super(EditDesign, self).get(self, request, pk=pk, **kwargs)
	
	
	def get_context_data(self, **kwargs):
		context = super(EditDesign, self).get_context_data(**kwargs)
		
		if not self.project_id is None:
			context['project_id'] = self.project_id
			context['project'] = Project.objects.get(pk=self.project_id)
		
		return context