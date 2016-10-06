MakeThis.react.components.LoginForm = React.createClass({
  displayName: "LoginForm",
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
      username: "",
      password: "",
      error: ""
    };
  },

  componentWillMount: function() {
    MakeThis.dispatcher.on(MakeThis.dispatcher.events.user.authentication.passed, this.handleAuthenticationPassed);
    MakeThis.dispatcher.on(MakeThis.dispatcher.events.user.authentication.failed, this.handleAuthenticationFailed);
    
    MakeThis.dispatcher.on(MakeThis.dispatcher.events.user.register.success, this.handleRegisterSuccess);
    MakeThis.dispatcher.on(MakeThis.dispatcher.events.user.register.error, this.handleRegisterError);
  },
  
  componentWillUnmount: function() {
    MakeThis.dispatcher.off(MakeThis.dispatcher.events.user.authentication.passed, this.handleAuthenticationPassed);
    MakeThis.dispatcher.off(MakeThis.dispatcher.events.user.authentication.failed, this.handleAuthenticationFailed);
    
    MakeThis.dispatcher.off(MakeThis.dispatcher.events.user.register.success, this.handleRegisterSuccess);
    MakeThis.dispatcher.off(MakeThis.dispatcher.events.user.register.error, this.handleRegisterError);
  },

  handleAuthenticationPassed: function() {
    this.context.router.push(this.props.next || '/');
  },

  handleAuthenticationFailed: function(event, data) {
    this.setState({ error: data.error_message });
  },
  
  handleRegisterSuccess: function() {
    this.context.router.push(this.props.next || '/');
  },
  
  handleRegisterError: function(event, error) {
    this.setState({ error: error });
  },

  handleUsernameChange: function(event) {
    this.setState({ username: event.target.value });
  },

  handlePasswordChange: function(event) {
    this.setState({ password: event.target.value });
  },
  
  handleRegisterClick: function(event) {
    event.preventDefault();
    
    MakeThis.dispatcher.action("register", {
      "username" : this.state.username,
      "password" : this.state.password
    });
  },

  handleSubmit: function(event) {
    event.preventDefault();

    MakeThis.dispatcher.action("login", {
      "username" : this.state.username,
      "password" : this.state.password
    });
  },

  render: function() {
    return (
      React.DOM.form({className: "login-form", onSubmit: this.handleSubmit, noValidate: true},
        React.DOM.label({htmlFor: "username"}, "Email"),
        React.DOM.input({type: "email", name: "username", noValidate: true, placeholder: "email@domain.com", onChange: this.handleUsernameChange}),
        React.DOM.label({htmlFor: "password"}, "Password"),
        React.DOM.input({type: "password", name: "password", placeholder: "Password", onChange: this.handlePasswordChange}),

        React.DOM.div({className: "button-container"},
          React.DOM.button({ className: "primary-cta button", onClick: this.handleRegisterClick }, "Register"),
          React.DOM.button({ type: "submit", className: "button" }, "Sign In")
        ),

        React.DOM.p({className: "error-text"}, this.state.error)
      )
    );
  }
});



MakeThis.react.pages.LoginPage = React.createClass({
  displayName: "LoginPage",

  componentWillMount: function() {
    if(MakeThis.stores.mainStore.getUser().authenticated) {
      this.props.history.push('/');
    }
  },

  render: function() {
    return (
      React.DOM.section({className: 'strata hero hero-image design-desk'},
        React.DOM.div({className: 'grid-container'},
          React.DOM.div({className: 'grid-item grid-spacer small-0 medium-5 large-5'}),
          React.DOM.div({className: 'grid-item small-12 medium-6 large-6'},
            React.DOM.h1({}, "Welcome Back"),
            React.createElement(MakeThis.react.components.LoginForm, { "next": "/" })
          )
        )
      )
    );
  }
});


MakeThis.react.pages.LogOutPage = React.createClass({
  displayName: "LogOutPage",

  contextTypes: {
    router: React.PropTypes.object
  },

  componentWillMount: function() {
    MakeThis.dispatcher.on(MakeThis.dispatcher.events.user.deauthentication.passed, this.handleLogout);
    MakeThis.dispatcher.on(MakeThis.dispatcher.events.user.deauthentication.failed, this.handleLogout);
  },

  componentWillUnmount: function() {
    MakeThis.dispatcher.off(MakeThis.dispatcher.events.user.deauthentication.passed, this.handleLogout);
    MakeThis.dispatcher.off(MakeThis.dispatcher.events.user.deauthentication.failed, this.handleLogout);
  },

  componentDidMount: function() {
    MakeThis.dispatcher.action("logout");
  },

  willTransitionTo: function(transition) {
    if(!MakeThis.stores.mainStore.getUser().authenticated) {
      transition.redirect('/', {}, {});
    }
  },

  handleLogout: function() {
    this.context.router.push('/');
  },

  render: function() {
    return (
      React.DOM.section({className: 'strata hero logout-page'})
    );
  }
});


MakeThis.react.pages.AccountPage = React.createClass({
    displayName: "AccountPage",

    mixins: [MakeThis.react.mixins.LoggedInMixin],

    render: function() {
        return (
            React.DOM.section({className: 'strata account-page'})
        );
    }
});
