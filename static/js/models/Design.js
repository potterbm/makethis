MakeThis.models.Design = function() {
	if(arguments.length < 1 || typeof arguments[0] !== "object") {
		arguments[0] = this.blankDesign;
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


MakeThis.models.Design.prototype.blankDesign = {
	'id' : 0,
	'title' : '',
	'description' : '',
	'image' : '',
	'comp_file' : '',
	'views' : 0,
	'like' : 0,
	'star' : 0,
	'created_at' : '',
	'updated_at' : ''
}


MakeThis.models.Design.prototype.api_url = '/api/design/';
MakeThis.models.Design.prototype.base_url = '/design/';


MakeThis.models.Design.prototype.detail_url = function() {
	return this.base_url + this.id;
}


MakeThis.models.Design.prototype.api = function(endpoint, method, data) {
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


MakeThis.models.Design.prototype.like = function() {
	var self = this;
	
	self.api('like', 'POST', {}).done(function(response) {
		if(response[status]) {
			self.liked(true);
		}
	});
}


MakeThis.models.Design.prototype.unlike = function() {
	var self = this;
	
	self.api('unlike', 'POST', {}).done(function(response) {
		if(response[status]) {
			self.liked(false);
		}
	});
}


MakeThis.models.Design.prototype.star = function() {
	var self = this;
	
	self.api('star', 'POST', {}).done(function(response) {
		if(response[status]) {
			self.starred(true);
		}
	});
}


MakeThis.models.Design.prototype.unstar = function() {
	var self = this;
	
	self.api('unstar', 'POST', {}).done(function(response) {
		if(response[status]) {
			self.starred(false);
		}
	});
}


MakeThis.models.Design.prototype.getDesignKO = function(element) {
	var item = ko.dataFor($(element).closest(".design")[0]);
	
	if(item.hasOwnProperty('item')) {
		item = item.item;
	}
	
	return item;
}


MakeThis.models.Design.prototype.attachEventHandlers = function(element) {
	var self = this;
	
	// Like
	
	$(element).on("click", ".like", function(e) {
		e.preventDefault();
		
		self.getDesignKO(this).like();
	});
	
	
	// Star
	
	$(element).on("click", ".star", function(e) {
		e.preventDefault();
		
		self.getDesignKO(this).star();
	});
}