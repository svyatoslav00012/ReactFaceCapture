import React from 'react';
import Webcam from 'react-webcam';


export default class CapturePhoto extends React.Component {

    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.onChoosePhoto = this.onChoosePhoto.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onUserMedia = this.onUserMedia.bind(this);
    }

    onChoosePhoto() {
        this.fileInput.click();
    }

    onNext() {
        alert("onNext")
    }

    onUserMedia(userMedia) {

    }

    render() {

        const scale = 1.5;

        const size = {
            width: this.props.videoConstraints.width * scale,
            height: this.props.videoConstraints.height * scale,
        };

        const mirror = {
            MozTransform: 'scale(-1, 1)',
            WebkitTransform: 'scale(-1, 1)',
            OTransform: 'scale(-1, 1)',
            transform: 'scale(-1, 1)'
        };

        let drawBox = (
            <div>
                <div
                    className="face-box"
                    style={{
                        height: this.props.faceBox.height,
                        width: this.props.faceBox.width,
                        transform: `translate(${this.props.faceBox.x}px,${this.props.faceBox.y}px)`,
                    }}
                >
                </div>
            </div>
        );

        return (

            <div style={size} className="main-div">
                <div className="typography">Add photo</div>
                <Webcam
                    style={this.props.mirror ? mirror : {}}
                    className="webcam-video"
                    audio={false}
                    imageSmoothing={true}
                    height={size.height}
                    width={size.width}
                    ref={this.props.setRef}
                    screenshotFormat="image/jpeg"
                    screenshotQuality={1}
                    videoConstraints={this.props.videoConstraints}
                    onUserMedia={this.onUserMedia}
                />
                {drawBox}
                <div className="oval"/>
                <div className="vl"/>
                <div className="hl"/>

                <input className="fileInput"
                       type="file"
                       onChange={this.props.handlePhotoChoose}
                       ref={input => this.fileInput = input}/>
                <button className="secondary-button photo-button" onClick={this.onChoosePhoto}/>
                <button className="main-button" onClick={this.props.onCapture}>Pick photo</button>
                <button className="next-button next-button" onClick={this.onNext}/>
            </div>
        );
    }
}