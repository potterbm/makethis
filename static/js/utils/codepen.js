MakeThis.code = MakeThis.code || {};
MakeThis.code.codepen = {};
MakeThis.code.codepen.timeout = 0;

/*

CodePen Integration

This code has two jobs:
	1. Provide code preview on submission/editing forms
	
	2. Load codepen embeds on display pages

*/


MakeThis.code.codepen.display = function() {
	
};


MakeThis.code.codepen.form = function() {
	var $previewElement = $(".js-codepen-preview")
	
	if($previewElement.length > 0) {
		$("input[name='codepen_id']").on('input', function(event) {
			
			$(".js-codepen-preview").empty();
			
			if($("input[name='codepen_id']").val().length > 0) {
				
				if(MakeThis.code.codepen.timeout != 0) {
					window.clearTimeout(MakeThis.code.codepen.timeout);
				}
				
				MakeThis.code.codepen.timeout = window.setTimeout(function() {
					MakeThis.code.codepen.preview($("input[name='codepen_id']").val());
				}, 500);
				
			}
		});
	}
};



MakeThis.code.codepen.preview = function(pen) {
	MakeThis.code.codepen.timeout = 0;
	$(".js-codepen-preview").addClass("loading");
	
	$.ajax(MakeThis.code.codepen.get_url(pen), {
		method: 'GET',
		dataType: 'jsonp',
		cache: true,
		crossDomain: true
	}).done(function(data) {
		$(".js-codepen-preview").html($.parseHTML(data.html)).removeClass("loading");
	}).fail(function() {
		MakeThis.code.codepen.timeout = 0;
	});
};


MakeThis.code.codepen.get_url = function(pen) {
	return ['http://codepen.io/api/oembed?url=http%3A//codepen.io/makethis/pen/', pen, '&format=js'].join('');
};


$(document).ready(function(e) {
	
	// Set up display loading
	MakeThis.code.codepen.display();
	
	// Set up form handling
	MakeThis.code.codepen.form();
	
});