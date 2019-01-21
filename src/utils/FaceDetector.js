import ImageMirrorer from "./ImageMirrorer";
import * as faceapi from "face-api.js";

class FaceDetector {

    constructor() {
        this.faceDetection = this.faceDetection.bind(this);
        this.detectFace = this.detectFace.bind(this);
        this.getFullFaceDescription = this.getFullFaceDescription.bind(this);
    }

    async loadModels() {
        const MODEL_URL = './models';
        await faceapi.loadMtcnnModel(MODEL_URL);
        await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
        await faceapi.loadFaceLandmarkModel(MODEL_URL);
        await faceapi.loadFaceRecognitionModel(MODEL_URL);
    }

    async faceDetection(imageSrc, mirror, webcam, setFaceBox, callback) {
        this.webcam = webcam;
        this.setFaceBox = setFaceBox;
        this.callback = callback;
        if (!imageSrc)
            mirror ?
                ImageMirrorer.captureAndMirrorImage(webcam, this.detectFace)
                :
                await this.detectFace(this.webcam.getScreenshot());
    }


    async detectFace(src, func) {
        await this.getFullFaceDescription(
            src,
        ).then(fullDesc => {
            if (!!fullDesc && !!fullDesc.detection)
                this.setFaceBox({
                    x: fullDesc.detection.box.x,
                    y: fullDesc.detection.box.y,
                    width: fullDesc.detection.box.width,
                    height: fullDesc.detection.box.height,
                });
            this.callback();
        });
    }

    async getFullFaceDescription(src) {
        let img = await faceapi.fetchImage(src);
        const mtcnnParams = {
            minFaceSize: 200
        };
        let res = await faceapi.mtcnn(img, mtcnnParams);
        return res[0];
    }

}

export default new FaceDetector();