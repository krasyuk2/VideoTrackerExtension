//Фоновый сервис
class BackgroundService {

    constructor() {
        this.timeCollection = [];
    }

    start() {
        //Получаем информацию, и делаем json
        chrome.runtime.onMessage.addListener((message, sender) => {
            this.timeCollection.push(message);
        });

        //При установке создаем alarm
        chrome.runtime.onInstalled.addListener(async () => {
            await chrome.alarms.create('check-video-timer',{
                delayInMinutes: 0.5,
                periodInMinutes: 0.5,
                persistAcrossSessions: false // Сохранения состояния между сессиями
            });
        });

        //Слушаем alarm, чтобы слать на сервер информацию каждые 30 сек
        chrome.alarms.onAlarm.addListener(async (alarm) => {
            if(this.timeCollection.length <= 0) return;
            let data = JSON.stringify(this.timeCollection);
            this.send(data);
            this.timeCollection.length = 0;
        });
    }

    //Отправить массив данных на сервер
    send(data) {

    }
}
let background = new BackgroundService();
background.start();