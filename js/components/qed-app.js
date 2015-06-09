var EventActions = require('../actions/event-actions');
var EventStore = require('../stores/event-store');
var QedMap = require('./qed-map');
var QedForm = require('./qed-form');

var React = require('react');


function getEventsState() {
    return { allEvents: EventStore.getAllEvents() };
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
        return getEventsState();
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
                <QedMap allEvents={this.state.allEvents} />
                <QedForm />
            </div>
        );
    },

    _onChange: function () {
        this.setState(getEventsState());
    }

});


module.exports = QedApp;
