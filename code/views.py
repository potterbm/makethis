from django.db.models import F

from django.views.generic import DetailView
from django.views.generic.edit import CreateView, UpdateView

from makethis.mixins import LoggedInMixin

from makethis.project.models import Project
from makethis.design.models import Design

from .models import Code
from .forms import CodeForm




class CodeDetailView(DetailView):
	context_object_name = "code"
	model = Code
	
	def get(self, request, pk=None, design_id=None, **kwargs):
		
		if not pk is None:
			Code.objects.filter(pk=pk).update(views=F('views') + 1)
		
		return super(CodeDetailView, self).get(self, request, pk=pk, design_id=design_id, **kwargs)



class CreateCode(LoggedInMixin, CreateView):
	template_name = 'code/code_create.html'
	form_class = CodeForm
	success_url = '/code'
	project_id = None
	
	def get(self, request, pk=None, project_id=None, **kwargs):
		
		self.project_id = project_id
		return super(CreateCode, self).get(self, request, pk=pk, **kwargs)
	
	
	def get_context_data(self, **kwargs):
		context = super(CreateCode, self).get_context_data(**kwargs)
		
		if not self.project_id is None:
			context['project_id'] = self.project_id
			context['project'] = Project.objects.get(pk=self.project_id)
		
		return context
	
	
	def form_valid(self, form):
		
		if not self.project_id is None:
			code = form.save(commit=False)
			code.project = Project.objects.get(pk=project_id)
			code.save()
		
		self.request.user.account.codepen_author = form.codpen_author
		self.request.user.account.developer = True
		self.request.user.account.save(commit=True)
		
		return super(CreateCode, self).form_valid(form)



class EditCode(LoggedInMixin, UpdateView):
	template_name = 'code/code_edit.html'
	form_class = CodeForm
	success_url = '/code'
	design_id = None
	
	
	def get(self, request, pk=None, design_id=None, **kwargs):
		self.design_id = design_id
		return super(EditCode, self).get(self, request, pk=pk, **kwargs)
	
	
	def get_context_data(self, **kwargs):
		context = super(EditCode, self).get_context_data(**kwargs)
		
		if not self.design_id is None:
			context['design_id'] = self.design_id
			context['design'] = Design.objects.get(pk=self.design_id)
		
		return context