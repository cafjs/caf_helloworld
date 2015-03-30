var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

var CHANGE_EVENT = 'change';

var MAX_NOTIFICATIONS = 5;

var newAppStore = function() {

    var server = new EventEmitter2();

    var state = {counter: -1, notif :[], isClosed: false};

    var that = {};

    var emitChange = function() {
        server.emit(CHANGE_EVENT);
    };

    that.addChangeListener = function(callback) {
        server.on(CHANGE_EVENT, callback);
    };

    that.removeChangeListener = function(callback) {
        server.removeListener(CHANGE_EVENT, callback);
    };

    that.getState = function() {
        return state;
    };

    var f = function(action) {
        switch(action.actionType) {
        case AppConstants.APP_UPDATE:
            state.counter = action.state;
            emitChange();
            break;
        case AppConstants.APP_NOTIFICATION:
            state.counter = action.state;
            state.notif.push(action.state);
            if (state.notif.length > MAX_NOTIFICATIONS) {
                state.notif.shift();
            }
            emitChange();
            break;
        case AppConstants.APP_ERROR:
            state.error = action.error;
            console.log('Error:' + action.error);
            emitChange();
            break;
        case AppConstants.WS_STATUS:
            state.isClosed = action.isClosed;
            emitChange();
            break;
        default:
            console.log('Ignoring '+ JSON.stringify(action));
        }
    };

    AppDispatcher.register(f);
    return that;
};

module.exports = newAppStore();