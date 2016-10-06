
MakeThis.react.components.ProjectList = React.createClass({
  displayName: 'ProjectList',

  /* Life cycle methods */

  getDefaultProps: function() {
    return {
      "display_format": "card"
    };
  },

  getInitialState: function() {
    var state = {
      "currentPage" : 0,
      "projects" : []
    };

    // Allow parent components to pass in project data.
    // Possibly deprecated
    if(this.props.projects && this.props.projects.length > 1) {
      state.projects = this.props.projects;
    }

    // Allow routing parameters to control project list pagination
    if(typeof(this.props.params) !== "undefined" && typeof(this.props.params.page) !== "undefined") {
      state.currentPage = this.props.params.page;
    }

    // Get any initial data the project store has for this page.
    // On a cold boot this will be no data.
    state.projects[state.currentPage] = MakeThis.stores.projectStore.getListPage(state.currentPage);

    return state;
  },

  componentWillMount: function() {
    // Subscribe to dispatcher events
    MakeThis.dispatcher.on(MakeThis.dispatcher.events.project.list.change, this.handleListChange);
  },

  componentDidMount: function() {
    // Load the project list page we're going to need when we mount.
    var projects = this.state.projects;
    projects[this.state.currentPage] = MakeThis.stores.projectStore.getListPage(this.state.currentPage)
    this.setState({ "projects" : projects });
  },
  
  componentWillUnmount: function() {
    MakeThis.dispatcher.off(MakeThis.dispatcher.events.project.list.change, this.handleListChange);
  },

  /* Event handler methods */

  handleNextPage: function(event) {
    event.preventDefault();
    
    this.loadPage(this.state.currentPage + 1);
  },

  handlePreviousPage: function(event) {
    event.preventDefault();

    if(this.state.currentPage > 0) {
      this.loadPage(this.state.currentPage - 1);
    }
  },

  handleListChange: function(event, listData) {
    var projects = this.state.projects;
    projects[listData.page] = listData.projects;
    this.setState({ "projects" : projects });
  },

  /* Helper methods */

  loadPage: function(pageNumber) {
    var projects = this.state.projects;
    projects[pageNumber] = MakeThis.stores.projectStore.getProjectListPage(pageNumber);
    this.setState({ "projects" : projects });
  },

  /* Render methods */

  render: function() {
    var projects = React.DOM.div({});
    if(this.state.projects && this.state.projects[this.state.currentPage]) {
      projects = this.state.projects[this.state.currentPage].map(function(project_id) {
        return (
            React.createElement(MakeThis.react.components.Project, { display_format: this.props.display_format, project_id: project_id, key: project_id })
        );
      }, this);
    }

    return (
      React.DOM.div({className: ['project-list grid-container project-', this.props.display_format, '-view'].join('')},
        projects,
        React.createElement(MakeThis.react.components.ProjectListControls, {handlePreviousPage: this.handlePreviousPage, handleNextPage: this.handleNextPage})
      )
    );
  }
});


MakeThis.react.components.ProjectListControls = React.createClass({
  displayName: 'ProjectListControls',

  render: function() {
    return (
      React.DOM.div({className: 'project-list-controls grid-item center small-12 medium-6 large-6 gutter-bottom'},
        React.DOM.a({className: 'project-list-previous-page', onClick: this.props.handlePreviousPage}, ""),
        React.DOM.a({className: 'project-list-next-page', onClick: this.props.handleNextPage}, "")
      )
    );
  }
});


MakeThis.react.components.Project = React.createClass({
  displayName: 'Project',
  contextTypes: {
    router: React.PropTypes.object
  },

  /* Life cycle methods */

  getDefaultProps: function() {
    return {
      "display_format" : "detail",
      "id" : 0
    };
  },

  getInitialState: function() {
    return {
      "project" : MakeThis.stores.projectStore.getProject(this.props.project_id)
    };
  },
  
  componentWillMount: function() {
    MakeThis.dispatcher.on(MakeThis.dispatcher.events.project.loaded, this.handleLoad);
    MakeThis.dispatcher.on(MakeThis.dispatcher.events.project.delete.success, this.handleDeleteSuccess);
  },

  componentDidMount: function() {

  },

  componentWillUnmount: function() {
    MakeThis.dispatcher.off(MakeThis.dispatcher.events.project.loaded, this.handleLoad);
    MakeThis.dispatcher.off(MakeThis.dispatcher.events.project.delete.success, this.handleDeleteSuccess);
  },

  /* Event handler methods */
  
  handleLoad: function(event, project) {
    this.setState({ "project" : project })
  },

  handleLike: function(event) {

  },

  handleStar: function(event) {

  },
  
  handleDeleteClick: function(event) {
    // TODO: Confirm delete
    
    MakeThis.dispatcher.action("project:delete", this.state.project.id);
  },
  
  handleDeleteSuccess: function(event) {
    this.context.router.push('/');
  },

  /* Helper methods */

  getDetailUrl: function(id) {
    return ['/project/', id].join('');
  },

  /* Render methods */

  renderBubble: function() {
    return (
      React.DOM.div({className: 'grid-item small-4 medium-2 large-1'},
        React.DOM.div({className: 'project'},
          React.DOM.div({className: 'project-image image-height-ratio-3-4', style: { backgroundImage: ["url('", this.state.project.image, "')"].join('') } }),
          React.DOM.div({className: 'project-info'},
            React.DOM.h2(null, this.state.project.title),
            React.DOM.p(null, this.state.project.description)
          )
        )
      )
    );
  },

  renderCard: function() {
    var projectClasses = ['project'];

    if(this.state.project.liked) {
      projectClasses.push('project-liked');
    }

    if(this.state.project.starred) {
      projectClasses.push('project-starred');
    }

    return (
      React.DOM.div({className: 'grid-item small-12 medium-4 large-4 gutter-bottom'},
        React.createElement(ReactRouter.Link, {to: ["/project/", this.props.project_id].join('')},
          React.DOM.div({className: projectClasses.join(' '), href: this.getDetailUrl(this.state.project.id)},
            React.DOM.div({ className: 'project-image image-height-ratio-3-4', style: { backgroundImage: ["url('", this.state.project.image, "')"].join('') } }),
            React.DOM.div({ className: 'project-info'},
              React.DOM.h2(null, this.state.project.title),
              React.DOM.p(null, this.state.project.description),
              React.createElement(MakeThis.react.components.ProjectStats, {views: this.state.project.views, design_count: this.state.project.design_count, code_count: this.state.project.code_count})
            )
          )
        )
      )
    );
  },

  renderDetail: function() {
    var projectClasses = ['project', ''];

    if(this.state.liked) {
      projectClasses.push('project-liked');
    }

    if(this.state.starred) {
      projectClasses.push('project-starred');
    }
    
    // Delete and edit buttons
    var controls = React.DOM.div({});
    if(MakeThis.stores.mainStore.getUser().email === this.state.project.owner) {
      controls = React.DOM.div({},
        React.DOM.button({className: 'button primary'}, 'Edit'),
        React.DOM.button({className: 'button dark', onClick: this.handleDeleteClick}, 'Delete')
      )
    }
    
    return (
      React.DOM.section({className: 'project-detail-view grid-container'},
        React.DOM.div({className: 'grid-item center small-12 medium-8 large-8 gutter-top gutter-bottom'},
          controls,
          React.DOM.div({className: projectClasses.join(' ')},
            React.DOM.h1(null, this.state.project.title),
            React.DOM.h5({className: 'created-at'}, MakeThis.utils.pretty_date(this.state.project.created_at)),
            React.DOM.div({ className: 'project-image image-height-ratio-3-4', style: { backgroundImage: ["url('", this.state.project.image, "')"].join('') } }),
            React.DOM.div({ className: 'project-info'},
              React.DOM.p(null, this.state.project.description),
              React.createElement(MakeThis.react.components.ProjectStats, {views: this.state.project.views, design_count: this.state.project.design_count, code_count: this.state.project.code_count}),
              React.createElement(MakeThis.react.components.ProjectTags, {tags: this.state.project.tags})
            ),
            React.createElement(MakeThis.react.components.DesignList, {designs: this.state.project.designs, display_format: "bubble"})
          )
        )
      )
    );
  },

  render: function() {
    switch (this.props.display_format) {
      case "bubble":
        return this.renderBubble.call(this);
      case "card":
        return this.renderCard.call(this);
      case "detail":
        return this.renderDetail.call(this);
    }
  }
});

MakeThis.react.components.ProjectStats = React.createClass({
  displayName: 'ProjectStats',

  render: function() {
    return (
      React.DOM.div({className: 'project-stats'},
        React.DOM.div({className: 'project-stat views'}, this.props.views),
        React.DOM.div({className: 'project-stat design-count'}, this.props.design_count),
        React.DOM.div({className: 'project-stat code-count'}, this.props.code_count)
      )
    );
  }
});

MakeThis.react.components.ProjectTags = React.createClass({
  displayName: 'ProjectTags',

  render: function() {
    var tags = React.DOM.div({}, "No tags");
    if(this.props.tags) {
      tags = this.props.tags.map(function(tag) {
       return (
          React.DOM.div({className: 'tag'}, tag)
       );
     });
    }

    return (
      React.DOM.div({className: 'tag-list'},
        tags
      )
    );
  }
});

MakeThis.react.components.ProjectControls = React.createClass({
  displayName: 'ProjectControls',

  render: function() {
    return (
      React.DOM.div({className: 'project-controls'},
        React.createElement('button', {className: 'project-control like'}),
        React.createElement('button', {className: 'project-control star'}),
        React.createElement('button', {className: 'project-control share'})
      )
    );
  }
});


MakeThis.react.components.ProjectForm = React.createClass({
  displayName: 'ProjectForm',
  propTypes: {
    next: React.PropTypes.string
  },
  contextTypes: {
    router: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {};
  },

  getInitialState: function() {
    return {
      title: "",
      description: ""
    };
  },
  
  componentWillMount: function() {
    MakeThis.dispatcher.on(MakeThis.dispatcher.events.project.create.success, this.handleProjectCreateSuccess);
    MakeThis.dispatcher.on(MakeThis.dispatcher.events.project.create.error, this.handleProjectCreateError);
  },
  
  handleProjectCreateSuccess: function(event) {
    this.context.router.push(this.props.next || '/');
  },
  
  handleProjectCreateError: function(event, error) {
    
  },
  
  handleTitleChange: function(event) {
    this.setState({ title: event.target.value });
  },
  
  handleDescriptionChange: function(event) {
    this.setState({ description: event.target.value });
  },
  
  handleImageChange: function(event) {
    this.setState({ image: event.target });
  },
  
  handleSubmit: function(event) {
    event.preventDefault();
    
    MakeThis.dispatcher.action("project:create", {
      title: this.state.title,
      description: this.state.description
    });
  },
  
  render: function() {
    return (
      React.DOM.section({className: 'project-detail-view grid-container'},
        React.DOM.div({className: 'grid-item center small-12 medium-6 large-6 gutter-top gutter-bottom'},
          React.DOM.form({className: 'project-form', onSubmit: this.handleSubmit},
            React.createElement(MakeThis.react.components.TextField, {type: "text", name: "title", noValidate: true, placeholder: "Project Title", autoCapitalize: "words", onChange: this.handleTitleChange}),
            React.createElement(MakeThis.react.components.TextBlob, {type: "text", name: "description", noValidate: true, placeholder: "A lot of text goes here", autoCapitalize: "sentence", onChange: this.handleDescriptionChange}),
            React.createElement(MakeThis.react.components.ImageField, {name: "image", handleImageChange: this.handleImageChange}),
            React.DOM.button({className: 'button primary', type: 'submit'}, "Submit")
          )
        )
      )
    );
  }
});
