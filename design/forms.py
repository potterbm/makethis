from django import forms

from .models import Design

class DesignForm(forms.ModelForm):
	
	class Meta:
		model = Design
		fields = ['description', 'image', 'comp_file', 'project']
		widgets = {
			'description' : forms.Textarea(attrs={'rows' : 9, 'cols' : 45, 'placeholder' : 'Describe your aspirations or intentions'}),
			'image' : forms.FileInput(attrs={'class' : 'js-image-preview', 'accept': 'image/*', 'multiple': False, 'formenctype': 'multipart/form-data'}),
			'comp_file' : forms.FileInput(attrs={'accept': 'image/*,video/*,application/*', 'multiple': False, 'formenctype': 'multipart/form-data'}),
		}
	
	
	def is_valid(self):
		super(ModelForm, self).is_valid()