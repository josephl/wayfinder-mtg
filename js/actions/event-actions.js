var AppDispatcher = require('../dispatcher/app-dispatcher.js');
var EventConstants = require('../constants/event-constants.js');


var EventActions = {

    create: function (eventData) {
        AppDispatcher.handleServerAction({
            'actionType': EventConstants.EVENT_CREATE,
            'eventData': eventData
        });
    },

    createAll: function (events) {
        AppDispatcher.handleServerAction({
            'actionType': EventConstants.EVENT_CREATE_ALL,
            'events': events
        });
    },

    filter: function (filterData) {
        AppDispatcher.handleViewAction({
            'actionType': EventConstants.FILTER,
            'filterData': filterData
        });
    }

};


module.exports = EventActions;
