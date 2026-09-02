//Сервис который инжектится в страницу, получает необходимую инфу
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
        if(!(event.target instanceof HTMLVideoElement)) return;
        let video = event.target;
        let st = this.state.get(video);
        if(!st) {
            st = {lastSent: 0};
            this.state.set(video,st);
        }
        let time = Math.floor(video.currentTime);
        if(time % 5 === 0 && time !== st.lastSent) {
            st.lastSent = time;
            let data = this.createVideoMessage("timeupdate", time, video.duration, video.playbackRate);
            this.sendInfoToBackground(data);
        }
    }

    //Поставили на паузу
    onPause(event) {
        return;
    }

    //Начали воспроизведение
    onPlay(event) {
        return;
    }

    //Перемотали
    onSeeked(event) {
        return;
    }

    //Метод отправки данных в background
    sendInfoToBackground(data) {
        chrome.runtime.sendMessage(data)
            .catch(err => console.log(err));
    }

    //Собираем модель для отправки данных
    createVideoMessage(type = '', time = 0, duration = 0, speed = 0) {
        return {type, time, duration, speed};
    }
}

let tracker = new VideoTracker();
tracker.start();