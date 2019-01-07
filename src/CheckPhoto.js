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
        const height = this.props.videoConstraints.height * 1.5;
        const width = this.props.videoConstraints.width * 1.5;
        const size = {height: height, width: width};

        return (<div style={size} className="main-div">
            <div className="typography">Confirm photo</div>
            <img style={size} src={this.props.imageSrc}/>
            <button className="secondary-button back-button" onClick={this.props.onBack}/>
            <button className="main-button" onClick={this.props.onConfirm}>Confirm</button>
            <button className="next-button next-button" onClick={this.onNext}/>
        </div>);
    }

}