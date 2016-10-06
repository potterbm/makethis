MakeThis.load = {};

/*

Data Initialization

Given several attributes and some JSON data, a container element can be filled with content using KO templating and data-binding. The required attributes are:

[data-load="<elementID>"] - This attribute being present triggers the connector JS to do its work. The elementID is the HTML ID of an element containing JSON to be loaded

[data-load-template="<elementID>"] - This attribute defines what template should be used for the KO binding

[data-load-collection] - This attribute, if present, tells the loading js to treat the JSON data as a collection and use the foreach: option in the KO template binding

[data-load-model="<modelName>"] - This attribute specifies a model existing in MakeThis.models which should be used for the JSON data

*/

MakeThis.load.load = function() {
	var $loaded = $("[data-load]");
	
	if($loaded.length > 0) {
		$loaded.each(MakeThis.load.loadHandler);
	}
	
	if(window.location.hash.length > 0 && $('#' + window.location.hash).length > 0) {
		$("html, body").animate({
			scrollTop : $(window.location.hash).scrollTop()
		});
	}
};

MakeThis.load.loadHandler = function(index, element) {
	var data_element_id = $(element).attr("data-load");
	var template_id = $(element).attr("data-load-template");
	
	if($(element).is("[data-load-collection]")) {
		$(element).attr({
			'data-bind' : "template: { name : '" + template_id + "', foreach: collection, as: 'item' }"
		});
		
		var collection = MakeThis.load.initializeCollection(data_element_id, $(element).attr("data-load-model"));
		
		ko.applyBindings({ 'collection' : collection }, element);
		collection[0].attachEventHandlers(element);
	}
	else {
		$(element).attr({
			'data-bind' : 'template: { name : "' + template_id + '", as : "item" }'
		});
		
		var item = MakeThis.load.initialize(data_element_id, $(element).attr("data-load-model"));
		
		ko.applyBindings({ 'item' : item }, element);
		item.attachEventHandlers(element);
	}
};


MakeThis.load.initialize = function(element_id, model) {
	var $element = $(['#', element_id].join(''));
	
	if($element.length < 1) {
		return {};
	}
	
	return new MakeThis.models[model](JSON.parse($element.text().trim()));
};


MakeThis.load.initializeCollection = function(element_id, model) {
	var $element = $(['#', element_id].join(''));
	
	if($element.length < 1) {
		return [];
	}
	
	var collection = JSON.parse($element.text().trim());
	
	return $.map(collection, function(item) {
		return new MakeThis.models[model](item);
	});
};


/*

Lazy Loading


This is a way for sections which are not important enough to be pre-loaded to specify that they want to be filled with data from the server.

[data-lazy-load="<endpoint>"] - This attribute being present triggers the lazy loading JS to do its work. <endpoint> is a path to an API endpoint which will provide the data

[data-lazy-load-template="<elementID>"] - This attribute defines what template should be used for the KO binding

[data-lazy-load-model="<modelName>"] - This attribute specifies a model existing in MakeThis.models which should be used to initialize the data

*/

MakeThis.load.lazyLoad = function() {
	var $lazyLoaded = $("[data-lazy-load]");
	
	if($lazyLoaded.length > 0) {
		$lazyLoaded.each(MakeThis.load.lazyLoadHandler);
	}
};

MakeThis.load.lazyLoadHandler = function(index, element) {
	var endpoint = $(element).attr("data-lazy-load");
	var template_id = $(element).attr("data-lazy-load-template");
	
	console.log(endpoint);
	console.log(template_id);
	
	MakeThis.load.api(endpoint).done(function(response) {
		console.log(response);
		
		if(response.status) {
			if(response.hasOwnProperty('collection') && response.collection) {
				$(element).attr({
					'data-bind' : "template: { name : '" + template_id + "', foreach: collection, as: 'item' }"
				});
				
				var collection = MakeThis.load.lazyInitialize(response.data, $(element).attr("data-lazy-load-model"), true);
				
				ko.applyBindings({ 'collection' : collection }, element);
				collection[0].attachEventHandlers(element);
			}
			else {
				$(element).attr({
					'data-bind' : 'template: { name : "' + template_id + '", data: item, as : "item" }'
				});
				
				var item = MakeThis.load.lazyInitialize(response.data, $(element).attr("data-lazy-load-model"));
				
				ko.applyBindings({ 'item' : item }, element);
				item.attachEventHandlers(element);
			}
		}
	});
};


MakeThis.load.lazyInitialize = function(object, model, collection) {
	if(collection) {
		return $.map(object, function(item) {
			return new MakeThis.models[model](item);
		});
	}
	else {
		return new MakeThis.models[model](object);
	}
}


MakeThis.load.api = function(endpoint) {
	return $.ajax(endpoint,
	{
		data : {},
		dataType : 'json',
		global : false,
		method : 'GET'
	});
}


$(document).ready(function(e) {
	
	// Loading
	MakeThis.load.load();
	
	
	// Lazy Loading
	MakeThis.load.lazyLoad();
	
});