import React from 'react';
import Webcam from 'react-webcam';

function getTransformProperty(isMirror, scaleFactor, x, y){
    const scaleValue = 'scale(' + (isMirror ? '-' : '') + scaleFactor + ', ' + scaleFactor + ')';
    const translateValue = 'translate(' + x + 'px, ' + y + 'px)';
    return getTransformStyleObject(scaleValue);// + ' ' + translateValue);
}


function getTransformStyleObject(transformValue) {
    return {
        MozTransform: transformValue,
        WebkitTransform: transformValue,
        OTransform: transformValue,
        transform: transformValue,
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

        const videoMidX = videoCnstrts.width / 2;
        const videoMidY = videoCnstrts.height / 2;

        const minScale = Math.max(rectWidth / videoCnstrts.width, rectHeight / videoCnstrts.height);
        const requiredScale = rectWidth / box.width;
        const scale = Math.max(minScale, requiredScale);

        const relX = box.x - videoMidX;
        const relY = box.y - videoMidY;

        const leftVal = -videoCnstrts.width / 2 - relX * scale;
        const topVal = -videoCnstrts.height / 2 - relY * scale + rectHeight / 6;

        const dx = videoCnstrts.width / 2 * (scale - 1);
        const dy = videoCnstrts.height / 2 * (scale - 1);


        const minTop = -(videoCnstrts.height + dy - rectHeight);
        const maxTop = dy;
        const minLeft = -(videoCnstrts.width + dx - rectWidth);
        const maxLeft = dx;

        const left = Math.min(Math.max(leftVal, minLeft), maxLeft);
        const top = Math.min(Math.max(topVal, minTop), maxTop);

        console.log(scale + " " + left + " " + top);
        console.log("faceBoxWidth = " + box.width);
        console.log();

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
                    top: rectHeight / 6,
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
                            top: top,
                            left: left,
                            ...getTransformProperty(this.props.mirror, scale, left, -top),
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