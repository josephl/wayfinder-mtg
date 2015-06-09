var React = require('react');

var EventInfo = require('./event-info');


/**
 * Determine if event should be shown
 * @param (eventData) data of event
 * @param (filters) Object of filters from EventStore
 * @returns bool
 */
function showEvent (eventData, filters) {
    var value;
    var startDateFilters;

    for (var key in filters) {
        value = eventData[key];
        if (key == 'StartDate') {
            // handle date range
            value = moment(value, 'MM/DD/YYYY');
            startDateFilters = filters[key];
            if ((startDateFilters.BEGINS && startDateFilters.BEGINS > value) ||
                (startDateFilters.ENDS && startDateFilters.ENDS < value)) {
                return false;
            }
        } else if (!filters[key][value]) {
            return false;
        }
    }
    return true;
}


/**
 * Google Map component, the primary View
 */
var QedMap = React.createClass({

    propTypes: {
        allEvents: React.PropTypes.object
    },

    componentDidMount: function () {
        var node = this.getDOMNode();
        var mapContainer = node.querySelector('#map');
        this.gmap = new google.maps.Map(mapContainer, this.mapOptions());
    },

    render: function () {
        var eventData;
        var eventsInfo = [];

        if (typeof(this.gmap) !== 'undefined') {
            for (var key in this.props.allEvents) {
                eventData = this.props.allEvents[key];
                eventsInfo.push(
                    <EventInfo {...eventData} key={key} map={this.gmap} />
                );
            }
        }

        return (
            <div>
                <div id="map" style={this.containerStyles}></div>
                {eventsInfo}
            </div>
        );
    },

    containerStyles: {
        position: 'absolute',
        height: '100%',
        width: '100%'
    },

    mapOptions: function () {
        return {
            center: new google.maps.LatLng(37.6, -95.665),
            zoom: 6
        };
    }

});


module.exports = QedMap;
