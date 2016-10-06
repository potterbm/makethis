
/*
* Main Store
*
* This store contains user stuff and general app data.
*/
MakeThis.flux.stores.MainStore = function() {
  this.session_data = this.getInitalState();
  this.user = this.getInitialUserState();

  this.registerActions();
};

/*
* Helper function to expose the functionality that this store offers.
*/
MakeThis.flux.stores.MainStore.prototype.registerActions = function() {
  if(!MakeThis.dispatcher) {
    return false;
  }

  MakeThis.dispatcher.register("login", this.loginAsUser.bind(this));
  MakeThis.dispatcher.register("logout", this.logout.bind(this));
  MakeThis.dispatcher.register("register", this.registerUser.bind(this));
};

MakeThis.flux.stores.MainStore.prototype.getInitalState = function() {
  if($("#session-data").length) {
    return JSON.parse($("#session-data").text().trim());
  }
  else {
    return {};
  }
};

MakeThis.flux.stores.MainStore.prototype.getInitialUserState = function() {
  if(!this.session_data) {
    this.session_data = this.getInitalState();
  }

  return this.session_data.user;
};

MakeThis.flux.stores.MainStore.prototype.getCSRFToken = function() {
  return this.session_data.csrf;
};

MakeThis.flux.stores.MainStore.prototype.getUser = function() {
  return this.user;
};



/*********************
* Actions            *
*********************/


/*
* loginAsUser - attempts to authenticate as a user
*
* params: {
*   username: <email>
*   password: <string>
* }
*
*/
MakeThis.flux.stores.MainStore.prototype.loginAsUser = function(data) {
  if(!data || !data.username || !data.password) {
    return false;
  }

  MakeThis.API('account/login', 'POST', {
    "email" : data.username,
    "password" : data.password
  }, {},
  [
    MakeThis.dispatcher.events.user.authentication.passed,
    MakeThis.dispatcher.events.user.change
  ], [
    MakeThis.dispatcher.events.user.authentication.failed
  ]);
};


/*
* logout - deauthenticates and destroys the current session
*
* params: <none>
*
*/
MakeThis.flux.stores.MainStore.prototype.logout = function() {
  MakeThis.API('account/logout', 'POST', {}, {},
  [
    MakeThis.dispatcher.events.user.deauthentication.passed,
    MakeThis.dispatcher.events.user.change
  ], [
    MakeThis.dispatcher.events.user.deauthentication.failed
  ]);
};

/*
* registerUser - attempts to register a new user
*
* params: {
*   username: <email>
*   password: <string>
* }
*
*/
MakeThis.flux.stores.MainStore.prototype.registerUser = function(data) {
  if(!data || !data.username || !data.password) {
    return false;
  }

  MakeThis.API('account/new', 'POST', {
    "email" : data.username,
    "password" : data.password
  }, {},
  [
    MakeThis.dispatcher.events.user.register.success,
    MakeThis.dispatcher.events.user.change
  ], [
    MakeThis.dispatcher.events.user.register.error
  ]).done(function(response) {
    this.user = response.data
  });
};



/*
* Project List Store
*
* This store handles all data for project lists and individual projects
*
*/

MakeThis.flux.stores.ProjectStore = function() {
  this.list = [];
  this.projects = {};
  
  this.registerActions();
};

MakeThis.flux.stores.ProjectStore.prototype.registerActions = function() {
  if(!MakeThis.dispatcher) {
    return false;
  }
  
  MakeThis.dispatcher.register("project:create", this.create.bind(this));
  MakeThis.dispatcher.register("project:edit", this.edit.bind(this));
  MakeThis.dispatcher.register("project:star", this.star.bind(this));
  MakeThis.dispatcher.register("project:like", this.like.bind(this));
  MakeThis.dispatcher.register("project:delete", this.delete.bind(this));
};


/******************
* Data Access     *
******************/

MakeThis.flux.stores.ProjectStore.prototype.getEmptyProject = function() {
  return {
    'id' : 0,
    'title' : '',
    'description' : '',
    'image' : '',
    'views' : 0,
    'like' : 0,
    'star' : 0,
    'created_at' : '',
    'updated_at' : ''
  };
};

MakeThis.flux.stores.ProjectStore.prototype.getListPage = function(page) {
  if(this.list[page]) {
    return this.list[page];
  }
  
  // If the page is null instead of undefined, we've already requested data for it
  if(this.list[page] !== null) {
    this.loadListPage(page);
    this.list[page] = null;
  }
  
  return [];
};

MakeThis.flux.stores.ProjectStore.prototype.getProject = function(project_id) {
  if(!project_id || project_id < 1) {
    return this.getEmptyProject();
  }
  
  if(typeof project_id !== "string") {
    project_id = String(project_id);
  }
  
  if(this.projects[project_id]) {
    return this.projects[project_id];
  }
  else {
    this.loadProject(project_id);
    return $.extend(this.getEmptyProject());
  }
};



/******************
* Actions         *
******************/

/*
* create - make a new project that doesn't exist
*
* params: {
*   title: <string>,
*   description: <string>
* }
*
*/
MakeThis.flux.stores.ProjectStore.prototype.create = function(project) {
  MakeThis.API('project/new', 'POST', {
    "title" : project.title,
    "description" : project.description
  }).done(function(response) {
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.create.success, response.data);
    this.handleProjectCreateSuccess(response.data);
  }.bind(this)).fail(function(response) {
    console.error("Project create error: " + response.error_message);
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.create.error, response.error_message);
  });
};


/*
* edit - update an existing project
*
* Only updates the fields of keys that exist in the payload
*
* params: {
*   <attribute>: <value>,
*   ...
* }
*
*/
MakeThis.flux.stores.ProjectStore.prototype.edit = function(project) {
  MakeThis.API('project/edit', 'POST', project).done(function(response) {
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.edit.success);
    // TODO: possibly send update event for project list here
  }).fail(function() {
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.edit.error, response.error_message);
  });
};


/*
* like - mark the project as likeed by the current user
*
* params: <project_id>
*
*/
MakeThis.flux.stores.ProjectStore.prototype.like = function(id) {
  var user_id = MakeThis.stores.mainStore.getUser().id;
  
  if(!user_id) {
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.like.error, "Could not find the current user");
    return;
  }
  
  if(!id) {
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.like.error, "That project doesn not exist.");
    return;
  }
  
  MakeThis.API(['project/', id, '/like'].join(''), 'POST', user_id).done(function(response) {
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.like.success);
    // TODO: possibly send update event for project list here
  }).fail(function() {
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.like.error, response.error_message);
  });
};


/*
* star - mark the project as starred by the current user
*
* params: <project_id>
*
*/
MakeThis.flux.stores.ProjectStore.prototype.star = function(id) {
  var user_id = MakeThis.stores.mainStore.getUser().id;
  
  if(!user_id) {
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.star.error, "Could not find the current user");
    return;
  }
  
  if(!id) {
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.star.error, "That project doesn not exist.");
    return;
  }
  
  MakeThis.API(['project/', id, '/star'].join(''), 'POST', user_id).done(function(response) {
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.star.success);
    // TODO: possibly send update event for project list here
  }).fail(function() {
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.star.error, response.error_message);
  });
};


/*
* delete - remove an existing project
*
* params: <project_id>
*
*/
MakeThis.flux.stores.ProjectStore.prototype.delete = function(id) {
  MakeThis.API(['project/', id, '/delete'].join(''), 'POST').done(function(response) {
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.delete.success);
    // Remove this project from all list pages
    this.removeListItem(id);
    // Remove the project from the global project registry
    delete this.projects[id];
  }.bind(this)).fail(function() {
    MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.delete.error, response.error_message);
  });
};




/*********************
* Helper Functions   *
*********************/


MakeThis.flux.stores.ProjectStore.prototype.loadListPage = function(page) {
  page = page || 0;
  MakeThis.API(['project/list/', page].join(''), 'GET').done(this.handleProjectListPageLoad.bind(this));
};


MakeThis.flux.stores.ProjectStore.prototype.removeListItem = function(id) {
  for(page in this.list) {
    if(!this.list.hasOwnProperty(page)) {
      break;
    }
    var deletedIndex = this.list[page].indexOf(id)
    
    if (deletedIndex > -1) {
      this.list[page].splice(deletedIndex, 1)
      MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.list.change, { "page" : page, "projects" : this.list[page] });
    }
  }
};


MakeThis.flux.stores.ProjectStore.prototype.loadProject = function(project_id) {
  MakeThis.API(['project/', project_id, '/detail'].join(''), 'GET').done(this.handleProjectLoadSuccess.bind(this)).fail(this.handleProjectLoadError.bind(this));
};


MakeThis.flux.stores.ProjectStore.prototype.handleProjectListPageLoad = function(response) {
  if(!response) {
    if(response.error_message) {
      console.error(["API Error (", response.error_code, "): ", response.error_message].join(''));
    }
    return false;
  }
  
  if(!response.collection || typeof(response.page) === "undefined") {
    console.error(["Failed to load list page (", response.error_code, "): ", response.error_message].join(''));
    return;
  }
  
  this.list[response.page] = this.processList(response.data);
  
  MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.list.change, { "page" : response.page, "projects" : this.list[response.page] });
};


MakeThis.flux.stores.ProjectStore.prototype.handleProjectLoadSuccess = function(response) {
  if(response.collection) {
    console.error(["Failed to load project (", response.error_code, "): ", response.error_message].join(''));
    return;
  }
  
  this.projects[response.data.id] = response.data;
  MakeThis.dispatcher.broadcast(MakeThis.dispatcher.events.project.loaded, response.data);
};


MakeThis.flux.stores.ProjectStore.prototype.handleProjectLoadError = function(response) {
  console.error(["API Error (", response.error_code, "): ", response.error_message].join(''));
};


MakeThis.flux.stores.ProjectStore.prototype.handleProjectCreateSuccess = function(project) {
  this.projects[project.id] = project;
  
  // TODO: cascade elements onto previous pages
  this.list[0].unshift(project.id);
};


MakeThis.flux.stores.ProjectStore.prototype.handleProjectCreateError = function() {
  
};


/*
* processList - traverse a list of projects and add them to the global project
* registry, overwriting if they're already there.
*/
MakeThis.flux.stores.ProjectStore.prototype.processList = function(list) {
  for(var n = 0; n < list.length; n++) {
      this.projects[list[n].id] = list[n];
      list[n] = list[n].id;
  }
  
  return list;
};



MakeThis.stores.mainStore = new MakeThis.flux.stores.MainStore();
MakeThis.stores.projectStore = new MakeThis.flux.stores.ProjectStore();
