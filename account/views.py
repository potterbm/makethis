from django.views.generic import DetailView
from django.views.generic.edit import CreateView, FormView

from makethis.mixins import LoggedInMixin

from django.contrib.auth.models import User

from .models import Account
from .forms import AccountForm, UserCreateForm, UserEditForm


class UserCreateView(CreateView):
	model = User
	form_class = UserCreateForm
	template_name = 'account/account_create.html'
	success_url = '/account'



class UserEditView(LoggedInMixin, FormView):
	model = User
	form_class = UserEditForm
	template_name = 'account/account_edit_user.html'



class AccountEditView(LoggedInMixin, FormView):
	template_name = 'account/account_edit.html'
	form_class = AccountForm
	success_url = '/account/edit'

	def form_valid(self, form):
		return super(AccountEditView, self).form_valid(form)
