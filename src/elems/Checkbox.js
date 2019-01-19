import React from 'react';
import '../static/css/checkbox.css';

export default class Checkbox extends React.Component {

    render() {
        return (<label className="checkbox">{this.props.label}
            <input type="checkbox" checked={this.props.value} onChange={this.props.onChange}/>
            <span className="checkmark"/>
        </label>);
    }
}

Checkbox.defaultProps = {
    value: false,
    label: ''
};