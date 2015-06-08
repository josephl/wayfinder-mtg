var EventActions = require('../actions/event-actions.js');
var EventStore = require('../stores/event-store.js');
var QedMap = require('./qed-map.js');

var React = require('react');


function getQedState() {
    return {
        allEvents: EventStore.getAllEvents(),
        eventFilters: EventStore.getEventFilters()
    };
}


/* Callback for a AJAX request for event data */
function eventReqListener () {
    var jsonResponse = JSON.parse(this.responseText);
    EventActions.createAll(jsonResponse.results);
}


/* Perform ajax request for all events information */
function initialEventRequest () {
    var req = new XMLHttpRequest();
    req.onload = eventReqListener;
    req.open('get', 'pptq1st16.json', true);
    req.send();
}


/**
 * Top level application component
 */
var QedApp = React.createClass({

    getInitialState: function () {
        return getQedState();
    },

    componentDidMount: function () {
        EventStore.addChangeListener(this._onChange);
        initialEventRequest();
    },

    componentWillUnmount: function () {
        EventStore.removeChangeListener(this._onChange);
    },

    render: function () {
        return (
            <div>
                <QedMap
                    allEvents={this.state.allEvents}
                    eventFilters={this.state.eventFilters}
                />
            </div>
        );
    },

    _onChange: function () {
        this.setState(getQedState());
    }

});


module.exports = QedApp;
