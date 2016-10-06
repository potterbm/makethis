class APIError(Exception):
    code = "generic_error"
    message = "Something bad happened"
    error_json = None
    status_code = 418
    
    def __init__(self, message=""):
        if message:
            self.message = message
        
        super(APIError, self).__init__(message)



class NoEndpointSpecified(APIError):
    code = "bad_url"
    message = "No API endpoint specified"
    status_code = 404
    
    def __init__(self, message=""):
        if message:
            self.message = message
        
        super(NoEndpointSpecified, self).__init__(self.message)



class EndpointNotFound(APIError):
    code = "no_url"
    message = "API endpoint does not exist."
    status_code = 404
    
    def __init__(self, message=""):
        if message:
            self.message = message
        
        super(EndpointNotFound, self).__init__(self.message)



class InvalidRequestMethod(APIError):
    code = "bad_method"
    message = "Invalid request method."
    status_code = 405
    
    def __init__(self, message=""):
        if message:
            self.message = message
        
        super(InvalidRequestMethod, self).__init__(self.message)



class IncorrectParameters(APIError):
    code = "bad_parameters"
    message = "Incorrect parameters were passed for this endpoint."
    status_code = 400
    
    def __init__(self, message=""):
        if message:
            self.message = message
        
        super(IncorrectParameters, self).__init__(self.message)



class IncorrectPassword(APIError):
    code = "bad_password"
    message = "Incorrect username or password."
    status_code = 403
    
    def __init__(self, message=""):
        if message:
            self.message = message
        
        super(IncorrectPassword, self).__init__(self.message)



class AccountInactive(APIError):
    code = "no_account"
    message = "That account does not exist."
    status_code = 403
    
    def __init__(self, message=""):
        if message:
            self.message = message
        
        super(AccountInactive, self).__init__(self.message)



class PermissionDenied(APIError):
    code = "no_permission"
    message = "You are not allowed to do that."
    status_code = 403
    
    def __init__(self, message=""):
        if message:
            self.message = message
        
        super(PermissionDenied, self).__init__(self.message)



class DatabaseAccessError(APIError):
    code = "db_error"
    message = "Something bad happened."
    status_code = 400
    
    def __init__(self, message=""):
        if message:
            self.message = message
        
        super(DatabaseAccessError, self).__init__(self.message)



class ObjectNotFound(APIError):
    code = "no_object"
    message = "Could not find that thing in the database."
    status_code = 404
    
    def __init__(self, message=""):
        if message:
            self.message = message
        
        super(ObjectNotFound, self).__init__(self.message)



class InvalidUser(APIError):
    code = "no_user"
    message = "That is not a valid user."
    status_code = 403
    
    def __init__(self, message=""):
        if message:
            self.message = message
        
        super(InvalidUser, self).__init__(self.message)



class InvalidProject(APIError):
    code = "no_project"
    message = "That is not a valid project."
    status_code = 418
    
    def __init__(self, message=""):
        if message:
            self.message = message
        
        super(InvalidProject, self).__init__(self.message)



class InvalidDesign(APIError):
    code = "no_design"
    message = "That is not a valid design."
    status_code = 418
    
    def __init__(self, message=""):
        if message:
            self.message = message
        
        super(InvalidDesign, self).__init__(self.message)



class InvalidCode(APIError):
    code = "no_code"
    message = "That is not valid code."
    status_code = 418
    
    def __init__(self, message="", error_json=None):
        if message:
            self.message = message
        
        if not error_json is None:
            self.error_json = error_json
        
        super(InvalidCode, self).__init__(self.message)