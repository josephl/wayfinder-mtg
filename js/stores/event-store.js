var AppDispatcher = require('../dispatcher/app-dispatcher.js');
var EventConstants = require('../constants/event-constants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


// Primary data
var _events = {};

var CHANGE_EVENT = 'change';


function create (eventData) {
    _events[eventData.Id] = eventData;
}


/* Like 'create' but for the large initial dump */
function createAll (events) {
    events.forEach(function (eventData) {
        create(eventData);
    });
}

function update (id, updates) {
    _events[id] = assign({}, _todos[id], updates);
}

function updateAll (updates) {
    for (var id in _events) {
        update(id, updates);
    }
}


var EventStore = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return _events;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});


// Register callback to handle updates
AppDispatcher.register(function (payload) {
    var action = payload.action;

    switch(action.actionType) {
        case EventConstants.EVENT_CREATE:
            create(action.eventData);
            EventStore.emitChange();
            break;
        case EventConstants.EVENT_CREATE_ALL:
            createAll(action.events);
            EventStore.emitChange();
            break;
        default:
            console.log('noop');
    }
});


module.exports = EventStore;
