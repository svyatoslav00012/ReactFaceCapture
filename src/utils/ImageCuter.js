class ImageCropper {

    constructor() {
        this.set = new Set();
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.img = new Image();
        this.crop = this.crop.bind(this);
    }

    cropImage(imageSrc, frameToCrop, rectWidth, rectHeight, passImageFunc) {
        this.set.add(passImageFunc);
        this.subImage = frameToCrop;
        this.rectWidth = rectWidth;
        this.rectHeight = rectHeight;
        this.img.onload = this.crop;
        this.img.src = imageSrc;
    }

    crop() {
        this.canvas.width = this.rectWidth;
        this.canvas.height = this.rectHeight;
        this.ctx.drawImage(this.img,
            this.subImage.x,
            this.subImage.y,
            this.subImage.width,
            this.subImage.height,
            0,
            0,
            this.rectWidth,
            this.rectHeight);
        for (let f of this.set)
            f(this.canvas.toDataURL());
    }


}

export default new ImageCropper();