/*
* Pages
*
* All pages are basically collections of components that exist between the header
* and the footer components.
*/

MakeThis.react.pages.AboutPage = React.createClass({
  displayName : "AboutPage",
  
  render : function() {
    return (
      React.DOM.div({ className : "about-page" },
        React.DOM.div({ className : "large strata hero dark" },
          React.DOM.h1(null, "Share. Meet. Create."),
          React.DOM.h2(null, "")
        ),
        React.DOM.div({ className : "grid-container" },
          React.DOM.div({ className : "strata panel-strata hero-image skater grid-item small-12 medium-12 large-12" },
            React.DOM.div({ className : "panel left" },
              React.DOM.h1(null, "Share an idea"),
              React.DOM.p(null, "Have a great idea? Share it with other creatives, or browse for a project that fires your imagination.")
            )
          ),
          React.DOM.div({ className : "strata panel-strata hero-image hay-field grid-item small-12 medium-12 large-12" },
            React.DOM.div({ className : "panel right" },
              React.DOM.h1(null, "Find a partner"),
              React.DOM.p(null, "Strong in some areas and not so strong in others? Join the club. Find someone with a complementary skill set to help you bring your project to life.")
            )
          ),
          React.DOM.div({ className : "strata panel-strata hero-image sunset grid-item small-12 medium-12 large-12" },
            React.DOM.div({ className : "panel left" },
              React.DOM.h1(null, "Create together"),
              React.DOM.p(null, "Whether it's a blockbuster app or a silly side project, working together with other people in the industry can make your project better.")
            )
          )
        )
      )
    );
  }
});


MakeThis.react.pages.HomePage = React.createClass({
  displayName : "HomePage",
  
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

    if (this.state.logged_in) {
      promo = React.createElement(MakeThis.react.components.SubmitProjectStrata);
    }
    else {
      promo = React.createElement(MakeThis.react.components.RegisterStrata);
    }

    return (
      React.DOM.div({ className : "homepage" },
        promo,
        React.createElement(MakeThis.react.components.ProjectList)
      )
    );
  }
});
