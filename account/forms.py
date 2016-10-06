from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from django.contrib.auth.models import User
from .models import Account

class UserCreateForm(UserCreationForm):

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        widgets = {
            'username' : forms.TextInput(attrs={'placeholder' : 'Username', 'data-validator' : 'username_free', 'data-validator-event' : 'blur'}),
            'email' : forms.EmailInput(attrs={'placeholder' : 'Username', 'data-validator' : 'username_free', 'data-validator-event' : 'blur'}),
            'password1' : forms.PasswordInput(attrs={'placeholder' : 'Password'}),
            'password2' : forms.PasswordInput(attrs={'placeholder' : 'Confirm Password'})
        }



class UserEditForm(UserChangeForm):

    class Meta:
        model = User
        fields = fields = ['username', 'email', 'password', 'first_name', 'last_name']
        widgets = {
            'username' : forms.TextInput(attrs={'placeholder' : 'Username', 'data-validator' : 'username_free', 'data-validator-event' : 'blur'}),
            'email' : forms.EmailInput(attrs={'placeholder' : 'Username', 'data-validator' : 'username_free', 'data-validator-event' : 'blur'}),
            'password' : forms.PasswordInput(attrs={'placeholder' : 'New password'}),
            'first_name' : forms.TextInput(attrs={'placeholder' : 'First'}),
            'last_name' : forms.TextInput(attrs={'placeholder' : 'Last'})
        }



class AccountForm(forms.ModelForm):

	class Meta:
		model = Account
		fields = ['user_url', 'codepen_author', 'birthday', 'avatar']
		widgets = {
            'user_url' : forms.TextInput(attrs={'placeholder' : 'A pretty URL for your account', 'data-validator' : 'user_url_free', 'data-validator-event' : 'change'}),
			'codepen_author' : forms.TextInput(attrs={'placeholder' : 'CodePen username'}),
			'birthday' : forms.DateInput(attrs={'placeholder' : 'We might send you a present!'}),
			'avatar' : forms.FileInput(attrs={'class' : 'js-image-preview', 'accept': 'image/*', 'multiple': False, 'formenctype': 'multipart/form-data'})
		}

	def is_valid(self):
		super(ModelForm, self).is_valid()
