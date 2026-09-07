//Фоновый сервис
class BackgroundService {

    constructor() {
        this.timeCollection = [];
    }

    start() {
        //Получаем информацию, и делаем json
        chrome.runtime.onMessage.addListener((message, sender) => {
            message.title = sender.tab.title;
            message.src = sender.url;
            message.webSiteUrl = sender.tab.url;
            this.validateMessage(message);
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
            console.log(data);
            this.send(data);
        });
    }

    //Отправить массив данных на сервер
    send(data) {
        fetch('http://127.0.0.1:5244/api/video/set-video-information', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: data
        }).then(
            resolve => console.log(resolve.text()),
            error => console.log(error)
        )
    }

    //Проверяем что числа не NaN
    validateMessage(message) {
        if(isNaN(message.duration)) message.duration = 0;
        else message.duration = Math.floor(message.duration);
    }
}
let background = new BackgroundService();
background.start();