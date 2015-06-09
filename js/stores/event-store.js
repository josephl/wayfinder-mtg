var AppDispatcher = require('../dispatcher/app-dispatcher');
var EventConstants = require('../constants/event-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


var EVENT_FILTER_DEFAULTS = {
    PlayFormatCode: {
        STANDARD: true,
        MODERN: true,
        SEALED: true
    },
    EventTypeCode: {
        PPTQ: true
    },
    StartDate:  {
        BEGINS: moment().startOf('day'),
        ENDS: moment('08/16/2015', 'MM/DD/YYYY')
    }
};

// Primary data
var _events = {};
var _eventFilters = assign(EVENT_FILTER_DEFAULTS, {});


var CHANGE_EVENT = 'change';
var FILTER_EVENT = 'filter';


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


/* Recursive nested assign implementation */
function nestedAssign(src, filter) {
    for (var key in filter) {
        if (typeof(filter[key]) === 'object') {
            nestedAssign(src[key], filter[key]);
        } else {
            src[key] = filter[key];
        }
    }
}


/* Set filter values 
 * @param (filterData) Object to update _eventFilters */
function filter (filterData) {
    nestedAssign(_eventFilters, filterData);
}


/**
 * Primary Store for application
 * Manages all events and filter options
 */
var EventStore = assign({}, EventEmitter.prototype, {

    getAllEvents: function () {
        return _events;
    },

    getEventFilters: function () {
        return _eventFilters;
    },

    /**
     * @params (eventData)
     * @returns bool
     */
    shouldEventBeShown: function (eventData) {
        var value;
        var startDateFilters;

        for (var key in _eventFilters) {
            value = eventData[key];
            if (key == 'StartDate') {
                // handle date range
                value = moment(value, 'MM/DD/YYYY');
                startDateFilters = _eventFilters[key];
                if ((startDateFilters.BEGINS && startDateFilters.BEGINS > value) ||
                    (startDateFilters.ENDS && startDateFilters.ENDS < value)) {
                    return false;
                }
            } else if (!_eventFilters[key][value]) {
                return false;
            }
        }
        return true;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    emitFilter: function () {
        this.emit(FILTER_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    addFilterListener: function (callback) {
        this.on(FILTER_EVENT, callback);
    },

    removeFilterListener: function (callback) {
        this.removeListener(FILTER_EVENT, callback);
    }

});


EventStore.setMaxListeners(10000);


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
        case EventConstants.FILTER:
            filter(action.filterData);
            EventStore.emitFilter();
            break;
        default:
            console.log('noop');
    }
});


module.exports = EventStore;
