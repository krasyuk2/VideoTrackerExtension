// это выполняется тогда, когда мы тыкаем на расширение и он выполняет на активной вкладке
const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: () => alert('Hello! Tab id')
});