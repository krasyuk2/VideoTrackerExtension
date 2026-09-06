//Сервис который инжектится в страницу, получает необходимую инфу
//Можно добавить логику продолжения просмотра
class VideoTracker {
    constructor() {
        this.state = new WeakMap();
        this.onTick = this.onTick.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onSeeked = this.onSeeked.bind(this);
    }

    start() {
        document.addEventListener("timeupdate", this.onTick, true);
        document.addEventListener("pause", this.onPause, true);
        document.addEventListener("play",this.onPlay, true);
        document.addEventListener("seeked", this.onSeeked, true);
    }

    //Изменение времени
    onTick(event) {
        let video = this.validateVideo(event);
        if(video === null) return;

        let st = this.state.get(video);
        if(!st) {
            st = {lastSent: 0};
            this.state.set(video,st);
        }
        let time = Math.floor(video.currentTime);
        if(time % 5 === 0 && time !== st.lastSent) {
            st.lastSent = time;
            let data = this.createVideoMessage("timeupdate", time, video.duration,
                video.playbackRate, video.poster);
            this.sendInfoToBackground(data);
        }
    }

    //Поставили на паузу
    onPause(event) {
        let video = this.validateVideo(event);
        if(video === null) return;
        let time = Math.floor(video.currentTime);
        let data = this.createVideoMessage("pause", time, video.duration,
            video.playbackRate, video.poster);
        this.sendInfoToBackground(data);
    }

    //Начали воспроизведение
    onPlay(event) {
        let video = this.validateVideo(event);
        if(video === null) return;
        let time = Math.floor(video.currentTime);
        let data = this.createVideoMessage("play", time, video.duration,
            video.playbackRate, video.poster);
        this.sendInfoToBackground(data);
    }

    //Перемотали
    onSeeked(event) {
        let video = this.validateVideo(event);
        if(video === null) return;
        let time = Math.floor(video.currentTime);
        let data = this.createVideoMessage("seeked", time, video.duration,
            video.playbackRate, video.poster);
        this.sendInfoToBackground(data);
    }

    //Метод отправки данных в background
    sendInfoToBackground(data) {
        chrome.runtime.sendMessage(data)
            .catch(err => console.log(err));
    }

    //Собираем модель для отправки данных
    createVideoMessage(type = '', time = 0, duration = 0, speed = 0, poster = '',) {
        return {type, time, duration, speed, poster};
    }

    validateVideo(videoEvent) {
        let videoPlayer = videoEvent.target
        if(!(videoPlayer instanceof HTMLVideoElement)) return null;
        return videoPlayer;
    }
}

let tracker = new VideoTracker();
tracker.start();