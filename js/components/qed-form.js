var EventActions = require('../actions/event-actions');
var React = require('react');


var overlayStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999
};


var Checkbox = React.createClass({

    render: function () {
        return (
            <input type="checkbox"
                value={this.props.value}
                checked={this.props.checked}
                onChange={this.changeHandler}>
                {this.props.value}
            </input>
        );
    },

    changeHandler: function (event) {
        var filterData = {};
        var formatFields = {};
        formatFields[this.props.value] = event.target.checked;
        filterData[FORMAT_KEY] = formatFields;
        EventActions.filter(filterData);
    }

});


var FormatField = React.createClass({

    render: function () {
        var checkboxes = [];
        for (key in this.props.filters) {
            checkboxes.push(
                <Checkbox
                    key={key}
                    value={key}
                    onChange={this.props.onChange}
                    checked={this.props.filters[key]} />
            );
        }
        return (
            <div>{checkboxes}</div>
        );
    }

});


var FORMAT_KEY = 'PlayFormatCode';


var QedForm = React.createClass({

    propTypes: {
        eventFilters: React.PropTypes.object
    },

    render: function () {
        return (
            <form style={overlayStyles}>
                <FormatField
                    key={FORMAT_KEY}
                    filters={this.props.eventFilters[FORMAT_KEY]} />
            </form>
        );
    }

});


module.exports = QedForm;
