import React from 'react';
import Webcam from 'react-webcam';

function scaledMirror(scaleFactor) {
    const scale = 'scale(-' + scaleFactor + ', ' + scaleFactor + ')';
    return transformScaleStyleObject(scale)
}

function transformScale(scaleFactor) {
    const scale = 'scale(' + scaleFactor + ', ' + scaleFactor + ')';
    return transformScaleStyleObject(scale);
}

function transformScaleStyleObject(scaleProperty) {
    return {
        MozTransform: scaleProperty,
        WebkitTransform: scaleProperty,
        OTransform: scaleProperty,
        transform: scaleProperty,
    };
}

export default class CapturePhoto extends React.Component {

    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.onChoosePhoto = this.onChoosePhoto.bind(this);
    }

    onChoosePhoto() {
        this.fileInput.click();
    }

    calculateScaleLeftTop() {
        const videoCnstrts = this.props.videoConstraints;
        const box = this.props.faceBox;
        const rectWidth = this.props.viewport.height * 0.45;
        const rectHeight = this.props.viewport.height * 0.8;

        const minScale = Math.max(rectWidth / videoCnstrts.width, rectHeight / videoCnstrts.height);
        const requiredScale = rectWidth / box.width;
        const scale = Math.max(minScale, requiredScale);

        const minTop = 0;
        const maxTop = videoCnstrts.height * scale - rectHeight;
        const minLeft = 0;
        const maxLeft = videoCnstrts.width * scale - rectWidth;

        const topVal = box.y - rectHeight / 6;
        const top = topVal;//Math.min(Math.max(topVal, minTop), maxTop);

        const leftVal = box.x;
        const left = leftVal;//Math.min(Math.max(leftVal, minLeft), maxLeft);

        console.log("");
        console.log("rectHeight = " + rectHeight);
        console.log("videoHeight = " + videoCnstrts.height * scale);
        console.log("boxY = " + box.y);
        console.log("boxWidth = " + box.width);
        console.log("maxTop = " + maxTop);
        console.log("topVal = " + topVal);
        console.log("top = " + top);

        // console.log("");
        // console.log("rectWidth = " + rectWidth);
        // console.log("videoWidth = " + videoCnstrts.width * scale);
        // console.log("boxX = " + box.x);
        // console.log("maxLeft = " + maxLeft);
        // console.log("leftVal = " + leftVal);
        // console.log("left = " + left);

        return {scale, left, top};
    }

    render() {

        const videoCnstrts = this.props.videoConstraints;
        const box = this.props.faceBox;
        const rectWidth = this.props.viewport.height * 0.45;
        const rectHeight = this.props.viewport.height * 0.8;

        const {scale, left, top} = this.calculateScaleLeftTop();

        const drawBox = (
            <div
                className="face-box"
                style={{
                    position: 'absolute',
                    height: Math.min(box.height * scale - 6, rectHeight),
                    width: Math.min(box.width * scale - 6, rectWidth),
                    top: 1 / 6 * rectHeight,
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
                            ...(this.props.mirror ? scaledMirror(scale) : transformScale(scale)),
                            left: -left,
                            top: -top,
                        }}
                        className="webcam-video"
                        audio={false}
                        imageSmoothing={true}
                        height={videoCnstrts.height}
                        width={videoCnstrts.width}
                        ref={this.props.setRef}
                        screenshotFormat="image/jpeg"
                        screenshotQuality={1}
                        videoConstraints={videoCnstrts}
                        onUserMedia={this.props.onUserMedia}
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
                <button className="next-button next-button" onClick={this.props.onNext}/>
            </div>
        );
    }
}