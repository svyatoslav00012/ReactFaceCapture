class ImageCuter {

    constructor() {
        this.set = new Set();
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.img = new Image();
        this.cutPart = this.cutPart.bind(this);
    }

    getPartOfAnImage(imageSrc, x, y, width, height, passImageFunc) {
        this.set.add(passImageFunc);
        this.subImage = {x, y, width, height};
        this.img.onload = this.cutPart;
        this.img.src = imageSrc;
    }

    cutPart() {
        this.canvas.width = this.img.width;
        this.canvas.height = this.img.height;
        this.ctx.drawImage(this.img, 0, 0, 640, 480, this.subImage.x, this.subImage.y, this.subImage.width, this.subImage.height);
        for (let f of this.set)
            f(this.canvas.toDataURL());
    }
}

export default new ImageCuter();