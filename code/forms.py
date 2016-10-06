from django import forms

from .models import Code

class CodeForm(forms.ModelForm):
	codepen_author = forms.CharField(max_length=200, widget=forms.TextInput(attrs={'placeholder' : 'codepen username'}))
	
	class Meta:
		model = Code
		fields = ['description', 'codepen_author', 'codepen_id']
		widgets = {
			'description' : forms.Textarea(attrs={'rows': 4, 'cols': 45, 'placeholder' : 'Tell us about your code!'}),
			'codepen_id' : forms.TextInput(attrs={'placeholder' : 'pen ID'}),
		}
	
	def is_valid(self):
		
		
		
		return super(forms.ModelForm, self).is_valid()