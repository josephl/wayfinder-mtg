var Dispatcher = require('flux').Dispatcher;


var AppDispatcher = function () {
    Dispatcher.call(this);
};

AppDispatcher.prototype = Object.create(Dispatcher.prototype);

AppDispatcher.prototype.handleViewAction = function (action) {
    this.dispatch({
        source: 'VIEW_ACTION',
        action: action
    });
};

AppDispatcher.prototype.handleServerAction = function (action) {
    this.dispatch({
        source: 'SERVER_ACTION',
        action: action
    });
};

AppDispatcher.prototype.constructor = AppDispatcher;


module.exports = new AppDispatcher();
