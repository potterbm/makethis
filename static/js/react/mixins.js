MakeThis.react.mixins.LoggedInMixin = {
    "willTransitionTo" : function(transition) {
        if(!MakeThis.stores.mainStore.getUser().authenticated) {
            transition.redirect('/account/login', {}, {'next' : transition.path});
        }
    }
};
