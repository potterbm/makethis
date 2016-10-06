MakeThis.react.pages.ProjectListPage = React.createClass({
    displayName : "ProjectListPage",
    
    getInitialState: function() {
      return {
        "logged_in" : MakeThis.stores.mainStore.getUser().authenticated
      };
    },
    
    getDefaultProps: function() {
      return {};
    },
    
    componentWillMount: function() {
      MakeThis.dispatcher.on(MakeThis.dispatcher.events.user.change, this.handleUserChange);
    },
    
    handleUserChange: function(event, user) {
      if(this.state.logged_in != user.authenticated) {
        this.setState({ "logged_in" : user.authenticated });
      }
    },
    
    componentWillUnmount: function() {
      MakeThis.dispatcher.off(MakeThis.dispatcher.events.user.change, this.handleUserChange);
    },

    render : function() {
        var promo;

        if (MakeThis.stores.mainStore.getUser().authenticated) {
            promo = React.createElement(MakeThis.react.components.SubmitProjectStrata);
        }
        else {
            promo = React.createElement(MakeThis.react.components.RegisterStrata);
        }

        return (
            React.DOM.div({ className : "site-content" },
              promo,
              React.createElement(MakeThis.react.components.ProjectList)
            )
        );
    }
});


MakeThis.react.pages.ProjectDetailPage = React.createClass({
  displayName : "ProjectDetailPage",
  
  render : function() {
    return (
      React.DOM.div({ className : "site-content" },
        React.createElement(MakeThis.react.components.Project, { "display_format" : "detail", "project_id" : this.props.params.id })
      )
    );
  }
});

MakeThis.react.pages.ProjectCreatePage = React.createClass({
  displayName : "ProjectCreatePage",
  
  render : function() {
    return (
      React.DOM.div({ className : "site-content" },
        React.createElement(MakeThis.react.components.ProjectForm, {})
      )
    );
  }
});