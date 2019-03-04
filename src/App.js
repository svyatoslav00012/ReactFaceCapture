import React from 'react';
import CapturePhoto from "./elems/CapturePhoto";
import axios from 'axios';
import './static/css/app.css';
import CheckPhoto from "./elems/CheckPhoto";
import Checkbox from "./elems/Checkbox";
import FaceDetector from "./utils/FaceDetector";
import {findMaxResolution} from "./utils/utils";
import ImageCuter from "./utils/ImageCuter";

export default class App extends React.Component {

    setRef = webcam => this.webcam = webcam;

    constructor(props) {
        super(props);
        this.webcam = null;
        const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.state = {
            imageSrc: null,
            mirror: true,
            handling: true,
            faceBox: {
                x: 0,
                y: 0,
                width: viewportHeight * 0.45,
                height: viewportHeight * 0.4,
            },
            videoConstraints: {
                width: 640,
                height: 480,
                frameRate: 60,
                facingMode: "user",
            },
            viewport: {
                width: viewportWidth,
                height: viewportHeight,
            },
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

    handleResize() {
        this.setState({
            viewport: {
                width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
            },
        });
    }

    handlingCurrentFrame() {
        //console.log("enter handling");
        if (this.state.handling && !!this.webcam) {
            FaceDetector.faceDetection(
                this.state.mirror,
                this.webcam,
                this.setFaceBox,
                this.handlingCurrentFrame
            );
            //   console.log("oo, handling!");
        }
    };

    onCapture() {
        const screen = this.webcam.getScreenshot();
        ImageCuter.getPartOfAnImage(screen, 0, 0, 300, 300, this.setImage);
        this.setState({handling: false});
    }

    onConfirm() {
        axios.post("/addImage", this.state.imageSrc);
        console.log(this.state.imageSrc);
    }

    onBack() {
        this.setState({handling: true});
        this.setImage(null);
        setTimeout(this.handlingCurrentFrame, 3000);
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
        const threshold = 10;
        return Math.abs(faceBox.x - this.state.faceBox.x) > threshold ||
            Math.abs(faceBox.y - this.state.faceBox.y) > threshold;
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
                                            onUserMedia={this.handlingCurrentFrame()}
                                            onCapture={this.onCapture}
                                            onNext={this.handlingCurrentFrame}
                                            handlePhotoChoose={this.handlePhotoChoose}
                                            setLeftInfo={this.setLeftInfo}
                                            setTopInfo={this.setTopInfo}/>);


        return (<div style={{display: 'flex'}}>
            {this.state.imageSrc ? checkPhoto : capturePhoto}
            <Checkbox value={this.state.mirror}
                      onChange={this.onMirrorChange}
                      label="mirror"/>
        </div>);
    }

}