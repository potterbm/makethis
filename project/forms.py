from django import forms

from .models import Project

class ProjectForm(forms.ModelForm):
	
	class Meta:
		model = Project
		fields = ['title', 'description', 'explanation', 'image']
		widgets = {
			'title' : forms.TextInput(attrs={'placeholder' : 'Give your project a name!'}),
			'description' : forms.Textarea(attrs={'placeholder' : 'A short description of your project', 'rows': 2, 'cols': 45}),
			'explanation' : forms.Textarea(attrs={'placeholder' : 'A longer explanation of your project', 'rows': 8, 'cols': 45}),
			'image' : forms.FileInput(attrs={'class' : 'js-image-preview', 'accept': 'image/*', 'multiple': False, 'formenctype': 'multipart/form-data'}),
		}
	
	def is_valid(self):
		return true
		super(ModelForm, self).is_valid()