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

        const videoCnstrts = this.props.videoConstraints;
        const rectHeight = this.props.viewport.height * 0.8;

        const scale = rectHeight / videoCnstrts.height;

        console.log(rectHeight + " / " + videoCnstrts.height + " = " + scale);

        const mirror = {
            MozTransform: 'scale(-1, 1)',
            WebkitTransform: 'scale(-1, 1)',
            OTransform: 'scale(-1, 1)',
            transform: 'scale(-1, 1)'
        };

        let drawBox = (
            <div
                className="face-box"
                style={{
                    position: 'absolute',
                    height: this.props.faceBox.height,
                    width: this.props.faceBox.width,
                    top: this.props.faceBox.y,
                    left: 0,
                }}
            />
        );

        return (

            <div className="main-div">
                <div className="typography">Add photo</div>
                <div className="webcam-div">
                    <Webcam
                        style={{
                            ...(this.props.mirror ? mirror : {}),
                            left: -this.props.faceBox.x * scale,
                            top: 0,//-this.props.faceBox.y * scale,
                        }}
                        className="webcam-video"
                        audio={false}
                        imageSmoothing={true}
                        height={videoCnstrts.height * scale}
                        width={videoCnstrts.width * scale}
                        ref={this.props.setRef}
                        screenshotFormat="image/jpeg"
                        screenshotQuality={1}
                        videoConstraints={videoCnstrts}
                        onUserMedia={this.onUserMedia}
                    />
                </div>
                {drawBox}
                <div className="oval-container">
                    <div className="oval"/>
                </div>
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