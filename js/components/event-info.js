var React = require('react');

var EventStore = require('../stores/event-store');


var REACTID_REGEX = / data-reactid="[^"]+"/g;
var addressKeys = [
    'Line1', 'Line2', 'Line3', 'City', 'StateProvinceCode', 'CountryCode'
];


function wizardsUrl (id, country) {
    return 'http://locator.wizards.com/#brand=magic&a=location&loc=' +
        id + '&addrid=' + id + '&p=' +
        encodeURIComponent(country);
}


function getVisibilityState(eventData) {
    return { visible: EventStore.shouldEventBeShown(eventData) };
}


/**
 * View for each Event
 * Also manages Maps-level controls for the Event, including
 * Markers and InfoWindows
 */
var EventInfo = React.createClass({

    propTypes: {
        map: React.PropTypes.object,
        key: React.PropTypes.number,
        Address: React.PropTypes.object
    },

    getInitialState: function () {
        return getVisibilityState(this.props);
    },

    componentDidMount: function () {
        var contentString;
        var position;

        EventStore.addFilterListener(this._onChange);
        contentString = this.getDOMNode().innerHTML.replace(
            REACTID_REGEX, '');
        position = new google.maps.LatLng(this.props.Address.Latitude,
            this.props.Address.Longitude);
        this.marker = new google.maps.Marker({
            position: position,
            title: this.props.Name
        });
        if (this.state.visible === true) {
            this.marker.setMap(this.props.map);
        }
        this.infoWindow = new google.maps.InfoWindow({
            content: contentString
        });

        this.clickListener = google.maps.event.addListener(this.marker, 'click',
            function () {
                if (this.infoWindow.getMap()) {
                    this.infoWindow.setMap(null);
                } else {
                    // TODO: turn off other info window if one is on
                    // Somehow notify parent map class of this
                    this.infoWindow.open(this.props.map, this.marker);
                }
            }.bind(this));
    },

    componentWillUnmount: function () {
        this.infoWindow.close();
        this.marker.setMap(null);
        google.maps.event.removeListener(this.clickListener);
        EventStore.removeFilterListener(this._onChange);
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        if (this.state.visible !== nextState.visible) {
            if (nextState.visible === false) {
                this.infoWindow.close();
                this.marker.setMap(null);
            } else if (nextState.visible === true) {
                this.marker.setMap(this.props.map);
            }
        }
        return false;
    },

    _onChange: function () {
        this.setState(getVisibilityState(this.props));
    },

    render: function () {
        return (
            <div style={{display: 'none'}}>
                <div>
                    <h3>{this.props.Address.Name}</h3>
                    <p>{this.formattedAddress()}</p>
                    <p>{this.props.PlayFormatCode} - {this.props.StartDate}</p>
                    {this.optionalInfo()}
                    <p>{this.contactLinks()}</p>
                </div>
            </div>
        );
    },

    hasPropString: function (propName) {
        return (typeof(this.props[propName]) === 'string' &&
                this.props[propName].length > 0);
    },

    contactLinks: function () {
        var wizardsLink = <a href={wizardsUrl(this.props.Address.Id, this.props.Address.CountryName)} target="_blank">Wizards page</a>;
        var url = this.props.Url;

        if (this.hasPropString('Url')) {
            if (!url.match(/^https?:\/\/.*$/)) {
                url = 'http://' + url;
            }
            return (
                <p>
                    {wizardsLink} | <a href={url} target="_blank">Organizer page</a>
                </p>
            );
        }
        return (
            <p>{wizardsLink}</p>
        );
    },

    formattedAddress: function () {
        var address = this.props.Address;
        var addressString = '';
        addressKeys.forEach(function (key) {
            var delim = addressString.length === 0 ? '' : ', ';
            if (address[key].length > 0) {
                addressString += delim + address[key];
            }
        });
        return addressString;
    },

    optionalInfo: function () {
        var els = [];
        var details = this.props.AdditionalDetails;
        var phone = this.props.PhoneNumber;
        var email = this.props.Email;

        if (typeof(details) === 'string' && details.length > 0) {
            els.push(<p key="details">{details}</p>);
        }
        if (typeof(phone) === 'string' && phone.length > 0) {
            els.push(<p key="phone">Phone: {phone}</p>);
        }
        if (typeof(email) === 'string' && email.length > 0) {
            els.push(
                <p key="email">Email: <a href={"mailto:" + email}>{email}</a></p>
            );
        }

        return els;
    }

});


module.exports = EventInfo;
