import React from 'react';

export default class CheckPhoto extends React.Component {

    constructor(props) {
        super(props);
        this.onNext = this.onNext.bind(this);
    }

    onNext() {
        console.log("next");
    }

    render() {
        return (<div className="main-div">
            <div className="typography">Confirm photo</div>
            <img className="check-photo-img" src={this.props.imageSrc}/>
            <button className="secondary-button back-button" onClick={this.props.onBack}/>
            <button className="main-button" onClick={this.props.onConfirm}>Confirm</button>
            <button className="next-button next-button" onClick={this.onNext}/>
        </div>);
    }

}