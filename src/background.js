
chrome.runtime.onInstalled.addListener(async () => {
    let oneSecond = 1 / 60;
    console.log("Start alarm");
    await chrome.alarms.create('check-video-timer',{
        delayInMinutes: oneSecond * 5,
        periodInMinutes: oneSecond * 5,
        persistAcrossSessions: false // Сохранения состояния между сессиями
    });
});

let a = 10;

// Это, чтобы слать на сервер данные о просмотре - например каждый 5 сек
chrome.alarms.onAlarm.addListener((alarm) => { // Слушатель alarm - когда возникает событие выполняем метод
    console.log(alarm.name + a++);
});

// Действие на активную вкладку - берет код переделывает в строку и кидает на страницу и там выполняет
chrome.tabs.onActivated.addListener(async ({tabId}) => {
    const tab = await chrome.tabs.get(tabId)

    await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: (title) => alert(`Click: ${title}`),
        args: [tab.title]
    }).catch(err => console.log(err))
});