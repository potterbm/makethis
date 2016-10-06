
/*
* Global App Components
*/

MakeThis.react.components.MakethisApp = React.createClass({
  displayName: 'MakethisApp',

  render: function() {
    return (
      React.DOM.div({ className: "app-root" },
        React.createElement(MakeThis.react.components.AppHeader),
        React.DOM.div({ className: 'content-wrapper' },
          this.props.children
        ),
        React.createElement(MakeThis.react.components.AppFooter, {})
      )
    );
  }
});

MakeThis.react.components.AppHeader = React.createClass({
  displayName: 'AppHeader',

  getInitialState: function() {
    return {
      "user" : MakeThis.stores.mainStore.getUser()
    };
  },

  componentWillMount: function() {
    MakeThis.dispatcher.on(MakeThis.dispatcher.events.user.change, this.handleUserChange);
  },
  
  componentWillUnmount: function() {
    MakeThis.dispatcher.off(MakeThis.dispatcher.events.user.change, this.handleUserChange);
  },

  handleUserChange: function(event, newUser) {
    this.setState({ user: newUser });
  },

  render: function() {
    return (
      React.DOM.header({},
        React.DOM.div({className: 'grid-container'},
          React.DOM.div({className: 'grid-item small-6 medium-4 large-1'}, React.createElement(MakeThis.react.components.Logo, null)),
          React.DOM.div({className: 'grid-item small-0 medium-4 large-8'}, React.createElement(MakeThis.react.components.AppNav, null)),
          React.DOM.div({className: 'grid-item small-12 medium-4 large-3'}, React.createElement(MakeThis.react.components.AccountNav, { user: this.state.user }))
        )
      )
    );
  }
});

MakeThis.react.components.AppNav = React.createClass({
  displayName: 'AppNav',

  render: function() {
    return (
      React.DOM.nav({className: 'app-nav'},
        React.DOM.ul({},
          React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/projects"}, "Projects")),
          React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/designs"}, "Designs")),
          React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/code"}, "Code")),
          React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/why"}, "Why?"))
        )
      )
    );
  }
});

MakeThis.react.components.AccountNav = React.createClass({
  displayName: 'AccountNav',

  getInitialState: function() {
    return {};
  },

  renderLoggedIn: function() {
    return (
      React.DOM.ul({},
        React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/account"}, this.props.user.display_name)),
        React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/account/logout"}, "Logout"))
      )
    );
  },

  renderLoggedOut: function() {
    return (
      logInOut = React.DOM.ul({},
        React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/account/login"}, "Login")),
        React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/account/new"}, "Register"))
      )
    );
  },

  render: function() {
    var logInOut;

    if(this.props.user.authenticated) {
      logInOut = this.renderLoggedIn();
    }
    else {
      logInOut = this.renderLoggedOut();
    }

    return (
      React.DOM.nav({className: 'account-nav right'},
        logInOut
      )
    );
  }
});

MakeThis.react.components.Logo = React.createClass({
  displayName: 'Logo',

  render: function() {
    return (
      React.DOM.h1({className: 'makethis-logo circle'},
        React.createElement(ReactRouter.Link, {to: "/"})
      )
    );
  }
});

MakeThis.react.components.AppFooter = React.createClass({
  displayName: 'AppFooter',

  render: function() {
    return (
      React.DOM.footer({},
        React.DOM.div({className: 'grid-container'},
          React.DOM.div({className: 'grid-item grid-spacer small-0 medium-1 large-1'}),
          React.DOM.div({className: 'grid-item small-12 medium-3 large-3'},
            React.DOM.h5({}, "MakeThis"),
            React.DOM.nav({},
              React.DOM.ul({},
                React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/faq"}, "FAQ")),
                React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/jobs"}, "Jobs")),
                React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/support"}, "Support"))
              )
            )
          ),
          React.DOM.div({className: 'grid-item small-12 medium-4 large-4'},
            React.DOM.h5({}, "Other Things"),
            React.DOM.nav({},
              React.DOM.ul({},
                React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/page"}, "Link Text")),
                React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/page"}, "Link Text")),
                React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/page"}, "Link Text"))
              )
            )
          ),
          React.DOM.div({className: 'grid-item small-12 medium-3 large-3'},
            React.DOM.h5({}, "Find Us"),
            React.DOM.nav({},
              React.DOM.ul({},
                React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/page"}, "Link Text")),
                React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/page"}, "Link Text")),
                React.DOM.li({}, React.createElement(ReactRouter.Link, {to: "/page"}, "Link Text"))
              )
            )
          ),
          React.DOM.div({className: 'grid-item grid-spacer small-0 medium-1 large-1'})
        )
      )
    );
  }
});



/*
* App Routes
*/

MakeThis.routes = React.createElement(ReactRouter.Route, { path: "/", component: MakeThis.react.components.MakethisApp },
  React.createElement(ReactRouter.IndexRoute, { component: MakeThis.react.pages.HomePage }),
  
  React.createElement(ReactRouter.Route, { name: "account_login",   path: "account/login",      component: MakeThis.react.pages.LoginPage }),
  React.createElement(ReactRouter.Route, { name: "account_logout",  path: "account/logout",     component: MakeThis.react.pages.LogOutPage }),
  React.createElement(ReactRouter.Route, { name: "account_base",    path: "account",            component: MakeThis.react.pages.AccountPage }),
  
  React.createElement(ReactRouter.Route, { name: "about",           path: "why",                component: MakeThis.react.pages.AboutPage }),
  
  React.createElement(ReactRouter.Route, { name: "project_list",    path: "projects",           component: MakeThis.react.pages.ProjectListPage }),
  React.createElement(ReactRouter.Route, { name: "project_list",    path: "projects/(:page)",   component: MakeThis.react.pages.ProjectListPage }),
  React.createElement(ReactRouter.Route, { name: "project_create",  path: "project/new",        component: MakeThis.react.pages.ProjectCreatePage }),
  React.createElement(ReactRouter.Route, { name: "project_detail",  path: "project/:id",        component: MakeThis.react.pages.ProjectDetailPage })
);



/*
* Routes and Initialization
*/
ReactDOM.render(
  React.createElement(ReactRouter.Router, {history: History.createHistory()}, MakeThis.routes),
  document.getElementById('js-react-app-root')
);
