MakeThis.models.Project = function() {
	if(arguments.length < 1 || typeof arguments[0] !== "object") {
		arguments[0] = this.blankProject;
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


MakeThis.models.Project.prototype.blankProject = {
	'id' : 0,
	'title' : '',
	'description' : '',
	'image' : '',
	'views' : 0,
	'like' : 0,
	'star' : 0,
	'created_at' : '',
	'updated_at' : ''
}


MakeThis.models.Project.prototype.api_url = '/api/project/';
MakeThis.models.Project.prototype.base_url = '/project/';
MakeThis.models.Project.prototype.pretty_date_format = '';


MakeThis.models.Project.prototype.detail_url = function() {
	return this.base_url + this.id;
}


MakeThis.models.Project.prototype.api = function(endpoint, method, data) {
	method = method || 'GET';
	data = data || {};

	return $.ajax([this.api_url, endpoint].join(''), {
		data : data,
		dataType : 'json',
		global : false,
		method : method
	});
}


MakeThis.models.Project.prototype.like = function() {
	var self = this;

	self.api('like', 'POST', {}).done(function(response) {
		if(response[status]) {
			self.liked(true);
		}
	});
}


MakeThis.models.Project.prototype.unlike = function() {
	var self = this;

	self.api('unlike', 'POST', {}).done(function(response) {
		if(response[status]) {
			self.liked(false);
		}
	});
}


MakeThis.models.Project.prototype.star = function() {
	var self = this;

	self.api('star', 'POST', {}).done(function(response) {
		if(response[status]) {
			self.starred(true);
		}
	});
}


MakeThis.models.Project.prototype.unstar = function() {
	var self = this;

	self.api('unstar', 'POST', {}).done(function(response) {
		if(response[status]) {
			self.starred(false);
		}
	});
}


MakeThis.models.Project.prototype.share = function() {
	console.log('Project ' + this.id + ' shared.');
}


MakeThis.models.Project.prototype.getProjectKO = function(element) {
	var item = ko.dataFor($(element).closest(".project")[0]);

	if(item.hasOwnProperty('item')) {
		item = item.item;
	}

	return item;
}


MakeThis.models.Project.prototype.pretty_date = function(date) {
	date = new Date(date);
	return [date.getDate(), MakeThis.months[date.getMonth() + 1], date.getFullYear()].join(' ');
}


MakeThis.models.Project.prototype.attachEventHandlers = function(element) {
	var self = this;

	// Like

	$(element).on("click", ".js-like-project", function(e) {
		e.preventDefault();

		self.getProjectKO(this).like();
	});


	// Share

	$(element).on("click", ".js-share-project", function(e) {
		e.preventDefault();

		self.getProjectKO(this).share();
	});
}
