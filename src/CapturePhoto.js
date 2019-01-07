import React from 'react';
import Webcam from "react-webcam";

export default class CapturePhoto extends React.Component {

    setRef = webcam => {
        this.webcam = webcam;
    };

    constructor(props) {
        super(props);
        this.state = {
            imageSrc: ''
        };
        this.fileInput = React.createRef();
        this.handleCapture = this.handleCapture.bind(this);
        this.handlePhotoChoose = this.handlePhotoChoose.bind(this);
        this.onChoosePhoto = this.onChoosePhoto.bind(this);
        this.onNext = this.onNext.bind(this);
    }

    handleCapture() {
        this.props.onCapture(this.webcam.getScreenshot())
    };

    onChoosePhoto() {
        this.fileInput.click();
    }

    handlePhotoChoose(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.props.onCapture(reader.result);
        };

        reader.readAsDataURL(file)
    }

    onNext() {
        alert("onNext")
    }

    render() {

        const size = {
            width: this.props.videoConstraints.width * 1.5,
            height: this.props.videoConstraints.height * 1.5,
        };

        return (
            <div style={size} className="main-div">
                <div className="typography">Add photo</div>
                <Webcam
                    className="webcam-video"
                    audio={false}
                    height={size.height}
                    width={size.width}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={this.props.videoConstraints}
                />
                <div className="oval"/>
                <div className="vl"/>
                <div className="hl"/>

                <input className="fileInput"
                       type="file"
                       onChange={this.handlePhotoChoose}
                       ref={input => this.fileInput = input}/>
                <button className="secondary-button photo-button" onClick={this.onChoosePhoto}/>
                <button className="main-button" onClick={this.handleCapture}>Pick photo</button>
                <button className="next-button next-button" onClick={this.onNext}/>
            </div>
        );
    }
}