class ImageProcessor {

    mirrorImage(imageData) {
        const pixelArray = toPixelArray(imageData.data);
        const pixelArray2D = to2Darray(pixelArray, imageData.width, imageData.height);
        const mirrored2DPixelArray = mirror2DArrayByX(pixelArray2D);
        const flattenPixelArray = toFlatArray(mirrored2DPixelArray);
        const arrayRGBA = pixelArrayToArrayOfRGBA(flattenPixelArray);
        const mirroredImageData = new ImageData(new Uint8ClampedArray(arrayRGBA), imageData.width, imageData.height);
        return mirroredImageData;
    }

}

export default new ImageProcessor();

function toPixelArray(arrayRGBA) {
    const pixelArray = new Array(arrayRGBA.length / 4);
    for (let i = 0; i < arrayRGBA.length / 4; i++) {
        pixelArray[i] = {
            r: arrayRGBA[i * 4],
            g: arrayRGBA[i * 4 + 1],
            b: arrayRGBA[i * 4 + 2],
            a: arrayRGBA[i * 4 + 3]
        }
    }
    return pixelArray;
}

function to2Darray(flatArray, width, height) {
    const array2D = new Array(height);
    for (let i = 0; i < height; ++i)
        array2D[i] = flatArray.slice(i * width, (i + 1) * width);
    return array2D;
}

function mirror2DArrayByX(array2D) {
    for (let i = 0; i < array2D.length; ++i)
        array2D[i] = array2D[i].reverse();
    return array2D;
}

function toFlatArray(array2D) {
    const flatArray = [];
    for (let i = 0; i < array2D.length; ++i)
        flatArray.push(...array2D[i]);
    return flatArray;
}

function pixelArrayToArrayOfRGBA(pixelArray) {
    const arrayRGBA = [];
    pixelArray.forEach(pixel => arrayRGBA.push(pixel.r, pixel.g, pixel.b, pixel.a));
    return arrayRGBA;
}