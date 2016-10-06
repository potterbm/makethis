MakeThis.react.components.RegisterStrata = React.createClass({
    displayName : "RegisterStrata",

    render : function() {
        return (
            React.DOM.section({ className : "site-promo-hero strata dark hero hero-image mountain black-overlay" },
                React.DOM.h1({}, "Get to work"),
                React.DOM.h2({}, "and make something awesome"),
                React.DOM.hr({ className : "tiny-keyline spacer" }),
                React.createElement(ReactRouter.Link, { to : "/project/new", className : "button primary" }, "Sign Up")
            )
        );
    }
});


MakeThis.react.components.SubmitProjectStrata = React.createClass({
    displayName : "SubmitProjectStrata",

    render : function() {
        return (
            React.DOM.section({ className : "site-promo-hero strata dark hero hero-image mountain black-overlay" },
                React.DOM.h1({}, "Have An Awesome Idea?"),
                React.DOM.h2({}, "want some help?"),
                React.DOM.hr({ className : "tiny-keyline spacer" }),
                React.createElement(ReactRouter.Link, { to : "/project/new", className : "button primary" }, "Submit Project")
            )
        );
    }
});
