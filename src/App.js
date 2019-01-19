import React from 'react';
import CapturePhoto from "./elems/CapturePhoto";
import axios from 'axios';
import './static/css/app.css';
import CheckPhoto from "./elems/CheckPhoto";
import Checkbox from "./elems/Checkbox";
import FaceDetector from "./utils/FaceDetector";
import ImageMirrorer from "./utils/ImageMirrorer";

const videoConstraints = {
    width: 640,
    height: 480,
    frameRate: 60,
    facingMode: "user",
};

export default class App extends React.Component {

    setRef = webcam => {
        this.webcam = webcam;
    };
    startHandleVideo = () => {
        this.interval = setInterval(() =>
                FaceDetector.faceDetection(
                    this.state.imageSrc,
                    this.state.mirror,
                    this.webcam,
                    this.setFaceBox
                ),
            300);
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
                width: videoConstraints.width * 1.5,
                height: videoConstraints.height * 1.5,
            }
        };

        this.setRef = this.setRef.bind(this);

        this.onCapture = this.onCapture.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onBack = this.onBack.bind(this);

        this.setImage = this.setImage.bind(this);
        this.setFaceBox = this.setFaceBox.bind(this);
        this.onMirrorChange = this.onMirrorChange.bind(this);

        this.handlePhotoChoose = this.handlePhotoChoose.bind(this);
    }

    async componentDidMount() {
        await FaceDetector.loadModels();
        this.startHandleVideo();
    }

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

    setFaceBox(facebox) {
        console.log(facebox);
        this.setState({
            faceBox: facebox
        });
    }

    setImage(src) {
        console.log(this);
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

        return (<div>
            {this.state.imageSrc ?
                <CheckPhoto videoConstraints={videoConstraints}
                            imageSrc={this.state.imageSrc}
                            onConfirm={this.onConfirm}
                            onBack={this.onBack}/> :
                <CapturePhoto webcam={this.webcam}
                              setRef={this.setRef}
                              mirror={this.state.mirror}
                              onCapture={this.onCapture}
                              videoConstraints={videoConstraints}
                              faceBox={this.state.faceBox}
                              handlePhotoChoose={this.handlePhotoChoose}/>}
            <Checkbox value={this.state.mirror}
                      onChange={this.onMirrorChange}
                      label="mirror"/>
        </div>);
    }

}