import React from 'react';
import CapturePhoto from "./elems/CapturePhoto";
import axios from 'axios';
import './static/css/app.css';
import CheckPhoto from "./elems/CheckPhoto";
import Checkbox from "./elems/Checkbox";
import FaceDetector from "./utils/FaceDetector";
import ImageMirrorer from "./utils/ImageMirrorer";
import {findMaxResolution} from "./utils/utils";

export default class App extends React.Component {

    setRef = webcam => {
        this.webcam = webcam;
    };

    constructor(props) {
        super(props);
        this.webcam = React.createRef();
        this.state = {
            imageSrc: null,
            mirror: true,
            faceBox: {
                x: 0,
                y: 0,
                width: 300,
                height: 606,
            },
            videoConstraints: {
                width: 640,
                height: 480,
                frameRate: 60,
                facingMode: "user",
            },
            viewport: {
                width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
            }
        };

        this.handleResize = this.handleResize.bind(this);
        this.setRef = this.setRef.bind(this);

        this.onCapture = this.onCapture.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onBack = this.onBack.bind(this);

        this.setImage = this.setImage.bind(this);
        this.setFaceBox = this.setFaceBox.bind(this);
        this.setVideoConstraintsResolution = this.setVideoConstraintsResolution.bind(this);
        this.onMirrorChange = this.onMirrorChange.bind(this);

        this.handlingCurrentFrame = this.handlingCurrentFrame.bind(this);
        this.handlePhotoChoose = this.handlePhotoChoose.bind(this);

    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        findMaxResolution().then(this.setVideoConstraintsResolution);
        FaceDetector.loadModels()
            .then(this.handlingCurrentFrame);
    }

    handleResize(e) {
        this.setState({
            viewport: {
                width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
            },
        });
    }

    handlingCurrentFrame() {
        FaceDetector.faceDetection(
            this.state.imageSrc,
            this.state.mirror,
            this.webcam,
            this.setFaceBox,
            this.handlingCurrentFrame
        );
    };

    onCapture() {
        if (this.state.mirror)
            ImageMirrorer.captureAndMirrorImage(this.webcam, this.setImage);
        else this.setImage(this.webcam.getScreenshot());
    }

    onConfirm() {
        axios.post("/addImage", this.state.imageSrc);
        console.log(this.state.imageSrc);
    }

    onBack() {
        this.setImage(null);
    }

    onMirrorChange(e) {
        this.setState({
            mirror: e.target.checked
        });
    }

    setFaceBox(faceBox) {
        if (this.isFarFromCurrent(faceBox))
            this.setState({
                faceBox: faceBox
            });
    }

    setVideoConstraintsResolution(resolution) {
        this.setState({
            videoConstraints: {
                ...this.state.videoConstraints,
                ...resolution
            }
        });
    }

    isFarFromCurrent(faceBox) {
        const thresholdX = 0;
        const thresholdY = 0;
        return Math.abs(faceBox.x - this.state.faceBox.x) > thresholdX ||
            Math.abs(faceBox.y - this.state.faceBox.y) > thresholdY;
    }

    setImage(src) {
        this.setState({
            imageSrc: src
        });
    }

    handlePhotoChoose(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => this.setImage(reader.result);
        reader.readAsDataURL(file)
    }

    render() {

        const checkPhoto = (<CheckPhoto videoConstraints={this.state.videoConstraints}
                                        imageSrc={this.state.imageSrc}
                                        onConfirm={this.onConfirm}
                                        onBack={this.onBack}/>);

        const capturePhoto = (<CapturePhoto webcam={this.webcam}
                                            setRef={this.setRef}
                                            {...this.state}
                                            onCapture={this.onCapture}
                                            handlePhotoChoose={this.handlePhotoChoose}/>);


        return (<div style={{display: 'flex'}}>
            {this.state.imageSrc ? checkPhoto : capturePhoto}
            <Checkbox value={this.state.mirror}
                      onChange={this.onMirrorChange}
                      label="mirror"/>
        </div>);
    }

}