class VideoTracker {
    constructor() {}

    getVideoPlayer() {
        let videoTag = document.querySelector("video");
        if(videoTag) {
            alert("сразу нашел" + videoTag.currentTime);
            videoTag.addEventListener("play", () => alert("play" + videoTag.currentTime));
        }
        else {
            console.log("start");
            let iframeTags = document.querySelectorAll("iframe");
            console.log(iframeTags.length);
            if(iframeTags.length === 0)
                return;

            //задумка была в том, чтобы дождаться, пока все iframe прогрузит, а после снова найти video
            //но мы инжектим во все iframe поэтому это бессмысленно
            // по сути весь код мы можем сократить до if(videoTag) -> если он есть то работаем.
            iframeTags.forEach(iframe => iframe.addEventListener("load", () => {
                console.log("iframe загружен");
            }))
        }
    }
}
let tracker = new VideoTracker();
tracker.getVideoPlayer();