//Сервис который инжектится в страницу, получает необходимую инфу
//Можно добавить логику продолжения просмотра
class VideoTracker {
    constructor() {
        this.onTick = this.onTick.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onSeeked = this.onSeeked.bind(this);
        this.timeArray = [];
        this.state = new WeakMap();
    }

    start() {
        if(window === window.top) {
            let og = this.getOgProperty();
            this.sendInfoToBackground({type: "metadata", og: og});
        }

        document.addEventListener("timeupdate", this.onTick, true);
        document.addEventListener("pause", this.onPause, true);
        document.addEventListener("play",this.onPlay, true);
        document.addEventListener("seeked", this.onSeeked, true);
    }

    //Изменение времени
    onTick(event) {
        let video = this.validateVideo(event);
        if(video === null) return;

        let time = Math.floor(video.currentTime);

        let st = this.state.get(video);
        if(!st) {
            st = {lastSend: -1}
            this.state.set(video, st);
        }

        if(this.timeArray.includes(time) || st.lastSend === time) return;
        this.timeArray.push(time);

        st.lastSend = time;
        if(this.timeArray.length >= 5) {
            let data = this.createVideoMessage("timeupdate", this.timeArray, video.duration,
                video.playbackRate);
            this.sendInfoToBackground(data);
        }
    }

    //Поставили на паузу
    onPause(event) {
        let video = this.validateVideo(event);
        if(video === null) return;
        let time = Math.floor(video.currentTime);
        let data = this.createVideoMessage("pause", [time], video.duration,
            video.playbackRate);
        this.sendInfoToBackground(data);
    }

    //Начали воспроизведение
    onPlay(event) {
        let video = this.validateVideo(event);
        if(video === null) return;
        let time = Math.floor(video.currentTime);
        let data = this.createVideoMessage("play", [time], video.duration,
            video.playbackRate);
        this.sendInfoToBackground(data);
    }

    //Перемотали
    onSeeked(event) {
        let video = this.validateVideo(event);
        if(video === null) return;
        let time = Math.floor(video.currentTime);
        let data = this.createVideoMessage("seeked", [time], video.duration,
            video.playbackRate);
        this.sendInfoToBackground(data);
    }

    //Метод отправки данных в background
    sendInfoToBackground(data) {
        chrome.runtime.sendMessage(data).then(
            result => this.timeArray.length = 0,
            error => console.log(error)
        )
    }

    //Собираем модель для отправки данных
    createVideoMessage(type = '', time = [], duration = 0, speed = 0) {
        return {type, time, duration, speed};
    }

    // Получение со страницы og атрибутов
    getOgProperty() {
        let ogProperty = {};
        let ogProperties = document.querySelectorAll("meta[property^='og:']");
        ogProperties.forEach(value => {
            let content = value.getAttribute("content");
            if(content)
               ogProperty[value.getAttribute("property").slice(3)] = content;
        })
        return ogProperty;
    }

    validateVideo(videoEvent) {
        let videoPlayer = videoEvent.target
        if(!(videoPlayer instanceof HTMLVideoElement)) return null;
        return videoPlayer;
    }
}

let tracker = new VideoTracker();
tracker.start();