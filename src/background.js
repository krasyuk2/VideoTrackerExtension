/*
chrome.runtime.onInstalled.addListener(async () => {
    let oneSecond = 1 / 60;
    console.log("Start alarm");
    await chrome.alarms.create('check-video-timer',{
        delayInMinutes: oneSecond * 5,
        periodInMinutes: oneSecond * 5,
        persistAcrossSessions: false // Сохранения состояния между сессиями
    });
});


// Это, чтобы слать на сервер данные о просмотре - например каждый 5 сек
chrome.alarms.onAlarm.addListener(async (alarm) => { // Слушатель alarm - когда возникает событие выполняем метод
    const tab = await getCurrentTab();
    await chrome.scripting.executeScript({
        target: {tabId: tab.id}, // внедряем во все фреймы
        func: getVideoPlayer
    }).catch(err => console.log(err))
});

// Действие на активную вкладку - берет код переделывает в строку и кидает на страницу и там выполняет
chrome.tabs.onActivated.addListener(async ({tabId}) => {
    const tab = await chrome.tabs.get(tabId)

    await chrome.scripting.executeScript({
        target: {tabId: tab.id, allFrames: true}, // внедряем во все фреймы
        func: getVideoPlayer
    }).catch(err => console.log(err))
});

function getVideoPlayer() {
    let videoTags = document.getElementsByTagName("video");
    let test = '';
    for(let video of videoTags) {
        test+= video.currentTime;
    }
    alert(test);
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}*/

chrome.runtime.onMessage.addListener((message, sender) => {
    console.log("пришло" + `type: ${message.type}\ntitle: ${sender.tab.title}\ntime: ${message.time}\nduration: ${message.duration}`);
})