

var React = require('react');
var AppSession = require('./session/AppSession');
var MyApp = require('./components/MyApp');
var AppActions = require('./actions/AppActions');

var cE = React.createElement;

AppSession.onopen = function() {
    console.log('open session');
    React.render(
        cE(MyApp, null),
        document.getElementById('content')
    );
    AppActions.init();
};


exports.main = function() {
    console.log('Hello');
};
