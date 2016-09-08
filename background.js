/* When the browser-action button is clicked... */
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({
        'url': "chrome://extensions/?options=" + chrome.runtime.id,
        'selected': true
    });
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo && changeInfo.status == "complete"){
        chrome.tabs.executeScript(tabId, {file: "jquery.js"}, function(){
            chrome.tabs.executeScript(tabId, {file: "script.js"});
        });
    }
});
