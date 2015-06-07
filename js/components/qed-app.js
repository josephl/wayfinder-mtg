var EventActions = require('../actions/event-actions.js');
var EventStore = require('../stores/event-store.js');
var QedMap = require('./qed-map.js');

var React = require('react');


function getQedState() {
    return {
        allEvents: EventStore.getAll()
    };
}


function eventReqListener () {
    var jsonResponse = JSON.parse(this.responseText);
    EventActions.createAll(jsonResponse.results);
}


function initialEventRequest () {
    var req = new XMLHttpRequest();
    req.onload = eventReqListener;
    req.open('get', 'pptq1st16.json', true);
    req.send();
}


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
                Qed App
                <QedMap
                    allEvents={this.state.allEvents}
                />
            </div>
        );
    },

    _onChange: function () {
        this.setState(getQedState());
    }

});


module.exports = QedApp;
