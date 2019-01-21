import ImageDataMirrorer from "./ImageDataMirrorer";

class ImageMirrorer {

    constructor() {
        this.set = new Set();
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.img = new Image();
        this.finishMirroring = this.finishMirroring.bind(this);
    }

    captureAndMirrorImage(webcam, passImageFunc) {
        this.set.add(passImageFunc);
        this.img.onload = this.finishMirroring;
        this.img.src = webcam.getScreenshot();
    }

    async finishMirroring() {
        this.canvas.width = this.img.width;
        this.canvas.height = this.img.height;
        this.ctx.drawImage(this.img, 0, 0);

        const currentImageData = this.ctx.getImageData(this.img.x, this.img.y, this.img.width, this.img.height);
        const mirroredImageData = ImageDataMirrorer.mirrorImage(currentImageData);
        this.ctx.putImageData(mirroredImageData, 0, 0, 0, 0, currentImageData.width, currentImageData.height);

        for (let f of this.set)
            f(this.canvas.toDataURL());
        this.set.clear();
    }

}

export default new ImageMirrorer();