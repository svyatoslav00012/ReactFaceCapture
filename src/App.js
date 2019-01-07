import React from 'react';
import CapturePhoto from "./CapturePhoto";
import axios from 'axios';
import './static/css/app.css';
import CheckPhoto from "./CheckPhoto";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            imageSrc: null
        };
        this.onCapture = this.onCapture.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onBack = this.onBack.bind(this);
    }

    setImage(newSrc) {
        this.setState({
            imageSrc: newSrc
        });
    }

    onCapture(newSrc) {
        this.setImage(newSrc);
    }

    onConfirm() {
        axios.post("/addImage", this.state.imageSrc);
    }

    onBack() {
        this.setImage(null);
    }

    render() {
        const videoConstraints = {
            width: 300,
            height: 480,
            facingMode: "user",
        };
        if (this.state.imageSrc == null)
            return <CapturePhoto onCapture={this.onCapture}
                                 videoConstraints={videoConstraints}/>;
        else return <CheckPhoto videoConstraints={videoConstraints}
                                imageSrc={this.state.imageSrc}
                                onConfirm={this.onConfirm}
                                onBack={this.onBack}/>
    }
}