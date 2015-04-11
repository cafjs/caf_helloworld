var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var AppSession = require('../session/AppSession');
var json_rpc = require('caf_transport').json_rpc;

var updateF = function(state) {
    var d = {
        actionType: AppConstants.APP_UPDATE,
        state: state
    };
    AppDispatcher.dispatch(d);
};


var errorF =  function(err) {
    var d = {
        actionType: AppConstants.APP_ERROR,
        error: err
    };
    AppDispatcher.dispatch(d);
};

var getNotifData = function(msg) {
    return json_rpc.getMethodArgs(msg)[0];
};

var notifyF = function(message) {
    var d = {
        actionType: AppConstants.APP_NOTIFICATION,
        state: getNotifData(message)
    };
    AppDispatcher.dispatch(d);
};

var wsStatusF =  function(isClosed) {
    var d = {
        actionType: AppConstants.WS_STATUS,
        isClosed: isClosed
    };
    AppDispatcher.dispatch(d);
};

var AppActions = {
    init: function(initialData) {
        if (typeof window === 'undefined') {
            // server side rendering
            updateF(initialData);
        } else {
            AppSession.hello(AppSession.getCacheKey(),
                             function(err, data) {
                                 if (err) {
                                     errorF(err);
                                 } else {
                                     updateF(data);
                                 }
                             });
        }
    },
    increment: function(inc) {
        AppSession.increment(inc, function(err, data) {
                                 if (err) {
                                     errorF(err);
                                 } else {
                                     updateF(data);
                                 }
                             });
    }
};

AppSession.onmessage = function(msg) {
    console.log('message:' + JSON.stringify(msg));
    notifyF(msg);
};

AppSession.onclose = function(err) {
    console.log('Closing:' + JSON.stringify(err));
    wsStatusF(true);
};


module.exports = AppActions;
