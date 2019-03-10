export function checkCameraExists() {
    navigator.getMedia = (navigator.getUserMedia || // use the proper vendor prefix
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    navigator.getMedia({video: true}, () => {
    }, () => alert("camera isn't available"));
}

const ResolutionsToCheck = [
    {width: 160, height: 120},
    {width: 320, height: 180},
    {width: 320, height: 240},
    {width: 640, height: 360},
    {width: 640, height: 480},
    {width: 768, height: 576},
    {width: 1024, height: 576},
    {width: 1280, height: 720},
    {width: 1280, height: 768},
    {width: 1280, height: 800},
    {width: 1280, height: 900},
    {width: 1280, height: 1000},
    {width: 1920, height: 1080},
    {width: 1920, height: 1200},
    {width: 2560, height: 1440},
    {width: 3840, height: 2160},
    {width: 4096, height: 2160}
];

let left = 0;
let right = ResolutionsToCheck.length;
let selectedWidth;
let selectedHeight;
let mid;

export async function findMaxResolution() {
    console.log("left = ", left, ", right = ", right);
    if (left > right) {
        console.log("Selected Height:Width = ", selectedWidth, ":", selectedHeight);
        return {height: selectedHeight, width: selectedWidth};
    }

    mid = Math.floor((left + right) / 2);

    const temporaryConstraints = {
        video: {
            mandatory: {
                minWidth: ResolutionsToCheck[mid].width,
                minHeight: ResolutionsToCheck[mid].height,
                maxWidth: ResolutionsToCheck[mid].width,
                maxHeight: ResolutionsToCheck[mid].height
            }
        }
    };

    return navigator.mediaDevices.getUserMedia(temporaryConstraints)
        .then(stream => {
            console.log("Success for --> ", mid, " ", ResolutionsToCheck[mid]);
            selectedWidth = ResolutionsToCheck[mid].width;
            selectedHeight = ResolutionsToCheck[mid].height;
            left = mid + 1;
            for (let track of stream.getTracks()) {
                track.stop()
            }
            return findMaxResolution();
        }).catch(error => {
            console.log("Failed for --> " + mid, " ", ResolutionsToCheck[mid], " ", error);
            right = mid - 1;
            return findMaxResolution();
        });
}