MakeThis.forms = [];
/*

Remote Forms

If this file is included, any <form> element with [data-remote] attribute set will be taken over and treated as a remote form. When the form is submitted an AJAX request containing the serialized data will be sent to the server.

[data-remote="<endpoint>"] - This attribute triggers the form JS to act on this form and specifies where the remote form should be submitted to

[data-remote-next="<URL>"] - This attribute, if present, will cause the form to redirect when a success response is returned

[data-remote-error="error_code"] - This element will be shown

*/

MakeThis.Form = function($formElement) {
  this.promise = null;
  this.$form = $formElement;
  this.files = null;
  this.validators = [];
  var self = this;

  self.$form.on('submit', function(event) {
    self.handleSubmit.apply(self, arguments);
  });

  self.$form.on('input', function(event) {
    self.clearErrors.apply(self, arguments);
  });


  // If there are any file inputs on the page we'll do some setup stuff
  if(self.$form.find('input.js-image-preview[type="file"]').length > 0) {

    if(!window.File || !window.FileList || !window.FileReader) {
      self.$form.addClass("file-preview-not-supported");
    }
    else {
      self.imageInputSetup();
    }
  }

  // If any fields are asking for a validator, we'll make one for them
  if(self.$form.not("[data-validator='false'], [data-validator='off'], [data-validator='no']") && self.$form.find("input[data-validator]").length > 0) {
    self.$form.find("input[data-validator]").each(function(index, element) {
      self.validators.push(new MakeThis.Validator($(element)));
    });
  }
};



MakeThis.Form.prototype.imageInputSetup = function() {
  var self = this;

  self.$files = self.$form.find('input.js-image-preview[type="file"]');
  self.$files.wrap('<div class="file-preview"></div>').after('<div class="file-preview-progress"><span class="file-preview-bar"></span></div>');

  // Bind input change event to something
  self.$files.on('change', function(event) {
    self.handleImageSelect.apply(self, arguments);
  });
};


MakeThis.Form.prototype.handleImageSelect = function(event) {
  event.preventDefault();
  var self = this;

  var fileList = event.target.files || event.dataTransfer.files;

  var file = fileList.item(0); // This could be null

  if(!file) {
    return;
  }

  var fileReader = new FileReader();
  var $previewElement = $(event.target).closest(".file-preview").find(".file-preview-progress");

  fileReader.onloadstart = function(progressEvent) {
    self.startProgress(progressEvent, $previewElement);
  };

  fileReader.onprogress = function(progressEvent) {
    self.updateProgress(progressEvent, $previewElement);
  };

  fileReader.onload = function(progressEvent) {
    $previewElement.closest(".file-preview").css("background-image", 'url(' + progressEvent.target.result + ')');
  }

  fileReader.onloadend = function(progressEvent) {
    self.endProgress(progressEvent, $previewElement);
  }

  fileReader.readAsDataURL(file);
};


MakeThis.Form.prototype.startProgress = function(progressEvent, $previewElement) {
  console.log('startProgress');
  $previewElement.show();
};


MakeThis.Form.prototype.updateProgress = function(progressEvent, $previewElement) {
  console.log('updateProgress');
  if(progressEvent.lengthComputable) {
    $previewElement.find(".file-progress-bar").css("width", "" + (Math.round((progressEvent.loaded / progressEvent.total)) * 100) + "%");
  }
};


MakeThis.Form.prototype.endProgress = function(progressEvent, $previewElement) {
  console.log('endProgress');
  $previewElement.addClass("file-progress-finished").find(".file-progress-bar").css("width", "");

  window.setTimeout(function() {
    $previewElement.hide().removeClass("file-progress-finished").find(".file-progress-bar").css("width", "0%")
  }, 500);
};


MakeThis.Form.prototype.handleSubmit = function(event) {
  event.preventDefault();
  var self = this;

  self.clearErrors(event);

  if(self.$form.attr("method") === "GET") {
    self.formData = self.$form.serialize();
  }
  else {
    self.formData = {};
    self.$form.serializeArray().map(function(item) {
      self.formData[item.name] = item.value;
    });
  }

  self.promise = $.ajax(self.$form.attr("data-remote"), {
    data : self.formData,
    dataType : "json",
    global : false,
    method : self.$form.attr("method").toUpperCase(),
    complete : function() {
      self.handleComplete.apply(self, arguments);
    },
    error : function() {
      self.handleError.apply(self, arguments);
    },
  });
};


MakeThis.Form.prototype.clearErrors = function(event) {
  this.$form.find("[data-remote-error]").empty().attr("data-remote-error", '');

  this.$form.find("[data-error-element-name='" + event.target.name + "']").remove();
};


MakeThis.Form.prototype.displayErrors = function(responseJSON) {
  var self = this;

  if(responseJSON.error_json) {
    responseJSON.errors = JSON.parse(responseJSON.error_json);

    $.each(responseJSON.errors, function(name, e) {
      self.$form.find("[name='" + name + "']").after('<p class="error-text js-element-error" data-error-element-name="' + name + '" data-error-code="' + e[0].code + '">' + e[0].message + '</p>');
    });
  }
  else {
    self.$form.find("[data-remote-error]").text(responseJSON.error_message).attr("data-remote-error", responseJSON.error_code);
  }
};


MakeThis.Form.prototype.handleComplete = function(data) {
  this.$form.trigger('ajax:complete', arguments);
  this.$form.addClass("remote-ajax-complete");

  if(data.responseJSON.status) {

    if(this.$form.is("[data-remote-next]")) {
      window.location.assign(this.$form.attr("data-remote-next"));
    }

    this.$form.trigger('form:success', data);
    this.$form.addClass("remote-form-success");
  }
  else {
    this.$form.trigger('form:fail', data);
    this.$form.addClass("remote-form-fail");
    console.log(data.responseJSON);
    this.displayErrors(data.responseJSON);
  }
};


MakeThis.Form.prototype.handleError = function(data) {
  this.$form.trigger('ajax:error', arguments);
  this.$form.addClass("remote-ajax-error");
};



/*
  Form Validation

  Specific <input> elements can ask for validation to happen by marking themselves with [data-validator="<validator_name"].
  If the validator name exists, that validator will apply to the <input that requested it.

  Attributes

  The following attributes are required for a successful validator:
  [data-validator="<name>"] - where <name> is an actual validator
  [data-validator-event="<event>"] - where <event> is the name of the event to bind to for validation

  Validators

  username_free - calls the API to check if a username is taken

*/

MakeThis.Validator = function ($inputElement) {
  this.$input = $inputElement;
  this.promise = null;
  this.validate_on = this.$input.attr("data-validator-event") || 'change';


  this.$input.after('<div class="js-validator-display"></div>');
  this.$display = this.$input.next(".js-validator-display");

  var validators_requested = this.$input.attr("data-validator").split(/\s+/);
  $.each(validators_requested, function(index, validator_requested) {
    if(this.hasOwnProperty(validator_requested)) {
      this[validator_requested]();
    }
  });
};


MakeThis.Validator.prototype.username_free = function() {
  var self = this;

  self.$input.on(self.validate_on, function(event) {
    self.clearErrors(event);

    self.promise = $.get('/api/validate/username_free', {
      'data' : {
        'username' : $input.val()
      }
    });

    self.promise.done(function(response) {
      self.$input.removeClass("validator-working")
      if(!!response.data && !response.data.username_free) {
        self.displayError("That username is already taken.");
      }
    });
  });
};


MakeThis.Validator.prototype.user_url_free = function() {
  var self = this;

  self.$input.on(self.validate_on, function(event) {
    self.clearErrors(event);

    self.promise = $.get('/api/validate/user_url_free', {
      'data' : {
        'url' : $input.val()
      }
    });

    self.promise.done(function(response) {
      self.$input.removeClass("validator-working")
      if(!!response.data && !response.data.user_url_free) {
        self.displayError("That URL is already taken.");
      }
    });
  });
};


MakeThis.Validator.prototype.clearErrors = function() {
  this.$display.empty();
  this.$input.removeClass("validator-error")
};


MakeThis.Validator.prototype.displayError = function(message) {
  this.$display.text(message);
  this.$input.addClass("validator-error");
};



$(document).ready(function(e) {
  $("form[data-remote]").each(function(index, element) {
    MakeThis.forms.push(new MakeThis.Form($(element)));
  });
});
