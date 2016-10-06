"""

The following is an exhaustive list of API endpoints provided by this service. Words in the description surrounded by brackets are required parameters. Trailing slashes are technically allowed, but are discouraged because the URLs look cooler without them.


/api/account/login - authenticates a user and begins a session
/api/account/create - creates a user account with [username] and [password]
/api/account/projects - returns a list of projects submitted by the logged in user
/api/account/designs - returns a list of designs submitted by the logged in user
/api/account/code - returns a list of code submitted by the logged in user
/api/account/logout - logs out

/api/user/<user_id> - returns profile information about a user
/api/user/<user_id>/projects - returns a list of projects submitted by a user
/api/user/<user_id>/designs - returns a list of designs submitted by a user
/api/user/<user_id>/code - returns a list of code submitted by a user

/api/project/new - creates a project with the POSTed data
/api/project/<project_id>/edit - updates a project with the POSTed data
/api/project/<project_id>/delete - deletes a project
/api/project/list/<page_number> - lists all projects in order of creation offset by <page_number> * <page_size>
/api/project/<project_id>/designs - lists this project's designs in order of creation. No pagination here. #YOLO
/api/project/<project_id>/code - lists this project's code in order of creation. Also no pagination here.

/api/design/new - creates a design with the POSTed data
/api/design/<design_id>/edit - updates a design with the POSTed data
/api/design/<design_id>/delete - deletes a design
/api/design/list/<page_number> - lists all projects in order of creation offset by <page_number> * <page_size>

/api/code/new - creates a code with the POSTed data
/api/code/<code_id>/edit - updates a code with the POSTed data
/api/code/<code_id>/delete - deletes a code. I hate using that word as a singular noun.
/api/code/list/<page_number> - lists all projects in order of creation offset by <page_number> * <page_size>

"""

from inspect import getdoc
import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.utils.decorators import method_decorator

from django.views.generic.base import View

from makethis.mixins import LoggedInMixin, SerializeUserMixin
from makethis.api import errors as api_errors
from makethis.api.decorators import api_login_required

from makethis.account.models import Account

from makethis.project.models import Project
from makethis.project.forms import ProjectForm

from makethis.design.models import Design
from makethis.design.forms import DesignForm

from makethis.code.models import Code
from makethis.code.forms import CodeForm

from django.http import JsonResponse




class API(View):
    endpoint = ""
    request = None
    params = None
    page_size = 9

    def get(self, request, **kwargs):

        try:
            if not self.endpoint:
                raise api_errors.NoEndpointSpecified()

            method = getattr(self, self.endpoint)

            if not callable(method):
                raise api_errors.EndpointNotFound()

            self.request = request
            self.params = request.GET.copy()

            response_data = method(**kwargs)

        except (api_errors.APIError) as error:
            response_data = {}
            response_data['error_message'] = error.message
            response_data['error_code'] = error.code
            return JsonResponse(response_data, status=error.status_code)

        return JsonResponse(response_data)


    def post(self, request, endpoint="", **kwargs):

        for name, value in kwargs.items():
            print '{0} = {1}'.format(name, value)

        try:
            if not self.endpoint:
                raise api_errors.NoEndpointSpecified()

            method = getattr(self, self.endpoint)

            if not callable(method):
                raise api_errors.EndpointNotFound()

            self.request = request

            if request.body:
                self.params = json.loads(request.body)
            else:
                self.params = request.POST.copy()

            response_data = method(**kwargs)

        except (api_errors.APIError) as error:
            response_data = {}
            response_data['error_message'] = error.message
            response_data['error_code'] = error.code

            if error.error_json is not None:
                response_data['error_json'] = error.error_json
            
            return JsonResponse(response_data, status=error.status_code)

        return JsonResponse(response_data)


    def docs(self):
        return { 'docs' : getdoc(self) }


    def require_method(self, method):
        if not self.request.method == method:
            raise api_errors.InvalidRequestMethod()


    def require_parameters(self, required):
        for p in required:
            if p not in self.params:
                raise api_errors.IncorrectParameters()



class PostRestrictedAPI(API):

    @method_decorator(api_login_required)
    def post(self, request, **kwargs):
        return super(PostRestrictedAPI, self).post(request, **kwargs)




class LoginAPI(API):

    def login(self):
        """
        Logs in a user and begins a session
        """
        self.require_method('POST')
        self.require_parameters(['email', 'password'])

        user = authenticate(username=self.params['email'], password=self.params['password'])

        if user is None:
            raise api_errors.IncorrectPassword()

        if not user.is_active:
            raise api_errors.AccountInactive()

        login(self.request, user)
        return { 'collection' : False, 'data' : user.account.json(), 'message' : "Account login successful." }


    def logout(self):
        """
        Logs out the current user and ends the session
        """
        logout(self.request)

        return {}



class RegisterAPI(SerializeUserMixin, API):

    def create(self):
        """
        Creates a user account
        """
        self.require_method('POST')
        self.require_parameters(['email', 'password'])

        # For simplicity, your username is your email. Don't like it? Tough.
        self.params['username'] = self.params['email']

        # Let's face it, I'm not always going to want to confirm a password.
        if self.params.get('password1') is None:
            self.params['password1'] = self.params['password']
        if self.params.get('password2') is None:
            self.params['password2'] = self.params['password']

        form = UserCreationForm(self.params)

        if not form.is_valid:
            raise api_errors.InvalidUser()

        try:
            user = form.save()
        except:
            raise api_errors.DatabaseAccessError()

        # Create a blank account object for this user
        user.account = Account(user=user)
        user.save()
        user.account.save()

        # After a user is created, log in as that user
        user = authenticate(username=self.params['email'], password=self.params['password'])

        if user is None:
            raise api_errors.IncorrectPassword()

        if not user.is_active:
            raise api_errors.AccountInactive()

        login(self.request, user)

        return { 'message' : "Account created successfully.", 'collection' : False, 'data' : self.user_to_json(user) }



class AccountAPI(PostRestrictedAPI):


    def list_projects(self, page=1):
        """
        Lists projects submitted by the current user
        """
        self.require_method('GET')

        try:
            limit = self.params.get('limit', 0)

            if limit > 0:
                projects = Project.objects.filter(user=self.request.user).order_by("-created_at").all()[(page - 1) * self.page_size:limit]
            else:
                projects = Project.objects.filter(user=self.request.user).order_by("-created_at").all()[(page - 1) * self.page_size:page * self.page_size]
        except:
            raise api_errors.DatabaseAccessError()

        return { 'collection' : True, 'page' : page, 'data' : [p.json() for p in projects] }


    def list_designs(self, page=0):
        """
        Lists designs submitted by the current user
        """
        self.require_method('GET')

        try:
            limit = self.params.get('limit', 0)

            if limit > 0:
                designs = Design.objects.filter(user=self.request.user).order_by("-created_at").all()[(page - 1) * self.page_size:limit]
            else:
                designs = Design.objects.filter(user=self.request.user).order_by("-created_at").all()[(page - 1) * self.page_size:page * self.page_size]
        except:
            raise api_errors.DatabaseAccessError()

        return { 'collection' : True, 'page' : page, 'data' : [d.json() for d in designs] }


    def list_code(self, page=0):
        """
        Lists code submitted by the current user
        """
        self.require_method('GET')

        try:
            limit = self.params.get('limit', 0)

            if limit > 0:
                code = Code.objects.filter(user=self.request.user).order_by("-created_at").all()[(page - 1) * self.page_size:limit]
            else:
                code = Code.objects.filter(user=self.request.user).order_by("-created_at").all()[(page - 1) * self.page_size:page * self.page_size]
        except:
            raise api_errors.DatabaseAccessError()

        return { 'collection' : True, 'page' : page, 'data' : [c.json() for c in code] }



class UserAPI(SerializeUserMixin, API):

    def get_user(self, user_id=None, user_url=""):

        if user_id is None and not user_url:
            raise api_errors.EndpointNotFound()

        if user_id is not None:
            return User.objects.get(pk=user_id)
        else:
            return Account.objects.get(user_url=user_url).user


    def profile(self, **kwargs):
        """
        Returns data about a user
        """
        self.require_method('GET')

        try:
            user = self.get_user(**kwargs)

        except (api_errors.APIError) as error:
            raise

        except:
            raise api_errors.DatabaseAccessError()

        return { 'collection' : False, 'data' : self.user_to_json(user) }


    def list_projects(self, **kwargs):
        """
        Lists projects submitted by a user
        """
        self.require_method('GET')

        try:
            user = self.get_user(**kwargs)
            projects = Project.objects.filter(user=user).order_by("-created_at").all()

        except (api_errors.APIError) as error:
            raise

        except:
            raise api_errors.DatabaseAccessError()

        return { 'collection' : True, 'data' : [ p.json() for p in projects] }


    def list_designs(self, **kwargs):
        """
        Lists designs submitted by a user
        """
        self.require_method('GET')

        try:
            user = self.get_user(**kwargs)
            designs = Design.objects.filter(user=user).order_by("-created_at").all()

        except (api_errors.APIError) as error:
            raise

        except:
            raise api_errors.DatabaseAccessError()

        return { 'collection' : True, 'data' : [ d.json() for d in designs] }


    def list_code(self, **kwargs):
        """
        Lists code submitted by a user
        """
        self.require_method('GET')

        try:
            user = self.get_user(**kwargs)
            code = Code.objects.filter(user=user).order_by("-created_at").all()

        except (api_errors.APIError) as error:
            raise

        except:
            raise api_errors.DatabaseAccessError()

        return { 'collection' : True, 'data' : [ c.json() for c in code] }



class ProjectAPI(PostRestrictedAPI):


    def get_object(self, pk=None):
        if pk is None:
            raise api_errors.EndpointNotFound()

        try:
            project = Project.objects.get(pk=pk)
        except:
            raise api_errors.ObjectNotFound()

        return project


    def list(self, page=0):
        """
        Lists all recent projects with pagination
        """
        self.require_method('GET')

        lower = int(page or 0) * 12
        upper = lower + 12

        try:
            projects = Project.objects.order_by("-created_at")[lower:upper].all()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'collection' : True, 'page' : page, 'data' : [p.json() for p in projects] }


    def detail(self, pk=None):
        """
        Provides detailed information about this project
        """
        self.require_method('GET')

        project = self.get_object(pk)

        return { 'collection' : False, 'data' : project.detail_json() }


    def designs(self, pk=None, page=0):
        """
        Lists designs associated with a project
        """
        self.require_method('GET')

        project = self.get_object(pk)

        lower = int(page or 0) * 12
        upper = lower + 12

        try:
            designs = project.designs.order_by("-created_at")[lower:upper].all()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'collection' : True, 'page' : page, 'data' : [d.json() for d in designs] }


    def create(self):
        """
        Creates a project
        """
        self.require_method('POST')

        print self.params
        project = Project()
        project.title = self.params['title']
        project.description = self.params['description']
        project.user = self.request.user
        project.save()
        
        # form = ProjectForm(self.params, self.request.FILES)
        #
        # if not form.is_valid:
        #     raise api_errors.InvalidProject()
        #
        # try:
        #     project = form.save()
        # except:
        #     raise api_errors.DatabaseAccessError()

        return { 'message' : "Project created successfully", 'collection' : False, 'data' : project.json() }


    def like(self, pk=None):
        """
        Records a like for this project from the current user
        """
        self.require_method('POST')

        project = self.get_object(pk)

        if not project.like.filter(pk=self.request.user.pk).exists():
            project.like.add(self.request.user)

        return { 'message' : "Project liked." }


    def unlike(self, pk=None):
        """
        Records a like for this project from the current user
        """
        self.require_method('POST')

        project = self.get_object(pk)

        if project.like.filter(pk=self.request.user.pk).exists():
            project.like.remove(self.request.user)

        return { 'message' : "Project no longer liked." }


    def star(self, pk=None):
        """
        Records a star for this project from the current user
        """
        self.require_method('POST')

        project = self.get_object(pk)

        if not project.star.filter(pk=self.request.user.pk).exists():
            project.star.add(self.request.user)

        return { 'message' : "Project starred." }


    def unstar(self, pk=None):
        """
        Records a star for this project from the current user
        """
        self.require_method('POST')

        project = self.get_object(pk)

        if project.star.filter(pk=self.request.user.pk).exists():
            project.star.remove(self.request.user)

        return { 'message' : "Project no longer starred." }


    def edit(self, pk=None):
        """
        Updates a project
        """
        self.require_method('POST')

        project = self.get_object(pk)

        if not self.request.user == project.user:
            raise api_errors.PermissionDenied()

        form = ProjectForm(self.params, self.request.FILES, instance=project)

        if not form.is_valid:
            raise api_errors.InvalidProject()

        try:
            project = form.save()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'message' : "Project edited.", 'collection' : False, 'data' : project }


    def delete(self, pk=None):
        """
        Deletes a project
        """
        self.require_method('POST')

        project = self.get_object(pk)

        if not self.request.user == project.user:
            raise api_errors.PermissionDenied()

        try:
            project.delete()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'message' : "Project deleted successfully." }



class DesignAPI(PostRestrictedAPI):


    def get_object(self, pk=None):
        if pk is None:
            raise api_errors.EndpointNotFound()

        try:
            design = Design.objects.get(pk=pk)
        except:
            raise api_errors.ObjectNotFound()

        return design


    def list(self, page=0):
        """
        Lists all recent designs
        """
        self.require_method('GET')

        lower = int(page or 0) * 12
        upper = lower + 12

        try:
            designs = Design.objects.order_by("-created_at")[lower:upper].all()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'collection' : True, 'page' : page, 'data' : [d.json() for d in designs] }


    def create(self, project_id=None):
        """
        Creates a design
        """
        self.require_method('POST')

        form = DesignForm(self.params, self.request.FILES)

        if not form.is_valid:
            raise api_errors.InvalidDesign(error_json=form.errors.as_json())

        try:
            design = form.save()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'message' : "Design created successfully", 'collection' : False, 'data' : design }


    def edit(self, pk=None, project_id=None):
        """
        Creates a design
        """
        self.require_method('POST')

        design = self.get_object(pk)
        form = DesignForm(self.params, self.request.FILES)

        if not form.is_valid:
            raise api_errors.InvalidDesign(error_json=form.errors.as_json())

        try:
            design = form.save()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'message' : "Design created successfully", 'collection' : False, 'data' : design }


    def like(self, pk=None):
        """
        Records a like for this design from the current user
        """
        self.require_method('POST')

        design = self.get_object(pk)

        if not design.like.filter(pk=self.request.user.pk).exists():
            design.like.add(self.request.user)

        return { 'message' : "Design liked." }


    def unlike(self, pk=None):
        """
        Records a like for this design from the current user
        """
        self.require_method('POST')

        design = self.get_object(pk)

        if design.like.filter(pk=self.request.user.pk).exists():
            design.like.remove(self.request.user)

        return { 'message' : "Design no longer liked." }


    def star(self, pk=None):
        """
        Records a star for this design from the current user
        """
        self.require_method('POST')

        design = self.get_object(pk)

        if not design.star.filter(pk=self.request.user.pk).exists():
            design.star.add(self.request.user)

        return { 'message' : "Design starred." }


    def unstar(self, pk=None):
        """
        Records a star for this design from the current user
        """
        self.require_method('POST')

        design = self.get_object(pk)

        if design.star.filter(pk=self.request.user.pk).exists():
            design.star.remove(self.request.user)

        return { 'message' : "Design no longer starred." }


    def edit(self, pk=None):
        """
        Updates a design
        """
        self.require_method('POST')

        design = self.get_object(pk)

        if not self.request.user == design.user:
            raise api_errors.PermissionDenied()

        form = DesignForm(self.params, self.request.FILES, instance=design)

        if not form.is_valid:
            raise api_errors.InvalidProject()

        try:
            design = form.save()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'message' : "Design edited.", 'collection' : False, 'data' : design }


    def delete(self, pk=None):
        """
        Deletes a design
        """
        self.require_method('POST')

        design = self.get_object(pk)

        if not self.request.user == design.user:
            raise api_errors.PermissionDenied()

        try:
            design.delete()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'message' : "Design deleted successfully." }



class CodeAPI(PostRestrictedAPI):


    def get_object(self, pk=None):
        if pk is None:
            raise api_errors.EndpointNotFound()

        try:
            code = Code.objects.get(pk=pk)
        except:
            raise api_errors.ObjectNotFound()

        return code


    def list(self, page=0):
        """
        Lists all recent code
        """
        self.require_method('GET')

        lower = int(page or 0) * 12
        upper = lower + 12

        try:
            code = Code.objects.order_by("-created_at")[lower:upper].all()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'collection' : True, 'page' : page, 'data' : [c.json() for c in code] }


    def create(self, project_id=None):
        """
        Creates a code submission
        """
        self.require_method('POST')

        form = CodeForm(self.params)

        if not project_id is None:
            form.project = Project.objects.get(pk=project_id)

        if not form.is_valid():
            raise api_errors.InvalidCode(error_json=form.errors.as_json())

        try:
            code = form.save()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'message' : "Code created successfully", 'collection' : False, 'data' : code }


    def edit(self, pk=None, project_id=None):
        """
        Edits a code submission
        """
        self.require_method('POST')

        code = self.get_object(pk)
        form = CodeForm(self.params, instance=code)

        if not form.is_valid:
            raise api_errors.InvalidCode()

        try:
            code = form.save()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'message' : "Code created successfully", 'collection' : False, 'data' : code }


    def like(self, pk=None):
        """
        Records a like for this code from the current user
        """
        self.require_method('POST')

        code = self.get_object(pk)

        if not code.like.filter(pk=self.request.user.pk).exists():
            code.like.add(self.request.user)

        return { 'message' : "Code liked." }


    def unlike(self, pk=None):
        """
        Removes a like for this code from the current user
        """
        self.require_method('POST')

        code = self.get_object(pk)

        if code.like.filter(pk=self.request.user.pk).exists():
            code.like.remove(self.request.user)

        return { 'message' : "Code no longer liked." }


    def star(self, pk=None):
        """
        Records a star for this code from the current user
        """
        self.require_method('POST')

        code = self.get_object(pk)

        if not code.star.filter(pk=self.request.user.pk).exists():
            code.star.add(self.request.user)

        return { 'message' : "Code starred." }


    def unstar(self, pk=None):
        """
        Removes a star for this code from the current user
        """
        self.require_method('POST')

        code = self.get_object(pk)

        if code.star.filter(pk=self.request.user.pk).exists():
            code.star.remove(self.request.user)

        return { 'message' : "Code no longer starred." }


    def edit(self, pk=None):
        """
        Edits code.
        """
        self.require_method('POST')

        code = self.get_object(pk)

        if not self.request.user == code.user:
            raise api_errors.PermissionDenied()

        form = CodeForm(self.params, self.request.FILES, instance=code)

        if not form.is_valid:
            raise api_errors.InvalidProject()

        try:
            code = form.save()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'message' : "Code edited.", 'collection' : False, 'data' : code }


    def delete(self, pk=None):
        """
        Deletes code
        """
        self.require_method('POST')

        code = self.get_object(pk)

        if not self.request.user == code.user:
            raise api_errors.PermissionDenied()

        try:
            code.delete()
        except:
            raise api_errors.DatabaseAccessError()

        return { 'message' : "Code deleted successfully." }


class ValidateAPI(API):
    """
    Provides endpoints for form validation
    """

    def username_free(self):
        """
        Returns true if a username is available
        """
        self.require_method('GET')
        self.require_parameters(['username'])

        try:
            exists = User.objects.filter(username=self.params['url']).exists()
        except:
            exists = False

        return { 'collection' : False, 'data' : { 'username_free' : not exists } }


    def user_url_free(self):
        """
        Returns true if a username is available
        """
        self.require_method('GET')
        self.require_parameters(['url'])

        try:
            exists = Account.objects.filter(user_url=self.params['url']).exists()
        except:
            exists = False

        return { 'collection' : False, 'data' : { 'user_url_free' : not exists } }
