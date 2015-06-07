var React = require('react');


var QedMap = React.createClass({

    render: function () {
        var allEvents = [];

        for (var key in this.props.allEvents) {
            allEvents.push(
                <li key={key}>
                    {this.props.allEvents[key].OrganizationName}
                </li>
            );
        }

        return (
            <ul>
                {allEvents}
            </ul>
        );
    }

});


module.exports = QedMap;
