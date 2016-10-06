
MakeThis.API = function(endpoint, method, data, headers, success_events, failure_events) {
	var base_url = '/api/';
	method = method || 'GET';
	data = data || {};
	headers = headers || {};
  
  success_events = success_events || [];
  if(typeof(success_events) === "string" && success_events.length > 0) {
		success_events = [success_events];
	}
  
  failure_events = failure_events || [];
  if(typeof(failure_events) === "string" && failure_events.length > 0) {
		failure_events = [failure_events];
	}

	headers = $.extend({ 'Content-Type' : 'application/json' }, headers);
  
	if(!headers.hasOwnProperty("X-CSRFToken")) {
		headers["X-CSRFToken"] = MakeThis.stores.mainStore.getCSRFToken();
	}

	data = JSON.stringify(data);

	console.log('API request: ', {
		contentType: 'application/json',
		data : data,
		dataType : 'json',
		global : false,
		headers : headers,
		method : method,
		url : [base_url, endpoint].join('')
	});
	return $.ajax({
		contentType: 'application/json',
		data : data,
		dataType : 'json',
		global : false,
		headers : headers,
		method : method,
		url : [base_url, endpoint].join('')
	}).done(function(response) {
    for(e of success_events) {
      MakeThis.dispatcher.broadcast(e, response.data || {});
    }
  }).fail(function(response) {
    console.error("API Error", arguments);
    response = MakeThis.API.normalizeErrorResponse(response);
    for(e of failure_events) {
      MakeThis.dispatcher.broadcast(e, response);
    }
  });
};

MakeThis.API.normalizeErrorResponse = function(response) {
  if(!response) {
    return {};
  }
  
  if(response.responseJSON) {
    return response.responseJSON;
  }
  
  if(response.responseText) {
    try {
      return JSON.parse(response.responseText);
    }
    catch(e) {
      return response.responseText;
    }
  }
  
  return {};
};
