MakeThis.models.Code = function() {
	if(arguments.length < 1 || typeof arguments[0] !== "object") {
		arguments[0] = this.blankCode;
	}
	
	for(var property in arguments[0]) {
		if(property !== "id") {
			this[property] = ko.observable(arguments[0][property]);
		}
		else {
			this.id = arguments[0].id;
			this.api_url = [this.api_url, this.id, '/'].join('');
		}
	}
}


MakeThis.models.Code.prototype.blankCode = {
	'id' : 0,
	'title' : '',
	'description' : '',
	'image' : '',
	'codepen_id' : '',
	'views' : 0,
	'like' : 0,
	'star' : 0,
	'created_at' : '',
	'updated_at' : ''
}


MakeThis.models.Code.prototype.api_url = '/api/code/';
MakeThis.models.Code.prototype.base_url = '/code/';


MakeThis.models.Code.prototype.detail_url = function() {
	return this.base_url + this.id;
}


MakeThis.models.Code.prototype.api = function(endpoint, method, data) {
	method = method || 'GET';
	data = data || {};
	
	return $.ajax([this.api_url, endpoint].join(''),
	{
		data : data,
		dataType : 'json',
		global : false,
		method : method
	});
}


MakeThis.models.Code.prototype.like = function() {
	var self = this;
	
	self.api('like', 'POST', {}).done(function(response) {
		if(response[status]) {
			self.liked(true);
		}
	});
}


MakeThis.models.Code.prototype.unlike = function() {
	var self = this;
	
	self.api('unlike', 'POST', {}).done(function(response) {
		if(response[status]) {
			self.liked(false);
		}
	});
}


MakeThis.models.Code.prototype.star = function() {
	var self = this;
	
	self.api('star', 'POST', {}).done(function(response) {
		if(response[status]) {
			self.starred(true);
		}
	});
}


MakeThis.models.Code.prototype.unstar = function() {
	var self = this;
	
	self.api('unstar', 'POST', {}).done(function(response) {
		if(response[status]) {
			self.starred(false);
		}
	});
}


MakeThis.models.Code.prototype.getCodeKO = function(element) {
	var item = ko.dataFor($(element).closest(".code")[0]);
	
	if(item.hasOwnProperty('item')) {
		item = item.item;
	}
	
	return item;
}


MakeThis.models.Code.prototype.attachEventHandlers = function(element) {
	var self = this;
	
	// Like
	
	$(element).on("click", ".like", function(e) {
		e.preventDefault();
		
		self.getCodeKO(this).like();
	});
	
	
	// Star
	
	$(element).on("click", ".star", function(e) {
		e.preventDefault();
		
		self.getCodeKO(this).star();
	});
}