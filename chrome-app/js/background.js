// /* When the browser-action button is clicked... */
// chrome.browserAction.onClicked.addListener(function(tab) {
//     chrome.tabs.create({
//         'url': "chrome://extensions/?options=" + chrome.runtime.id,
//         'selected': true
//     });
// });

// If all works fine, just remove this code
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
//     if(changeInfo && changeInfo.status == "complete"){
//         chrome.tabs.executeScript(tabId, {file: "jquery.js"}, function(){
//             chrome.tabs.executeScript(tabId, {file: "script.js"});
//         });
//     }
// });

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.badgeText) {
        chrome.tabs.get(sender.tab.id, function(tab) {
            if (chrome.runtime.lastError) {
                return; // the prerendered tab has been nuked, happens in omnibox search
            }
            if (tab.index >= 0) { // tab is visible
                chrome.browserAction.setBadgeText({tabId:tab.id, text:message.badgeText});
            } else { // prerendered tab, invisible yet, happens quite rarely
                var tabId = sender.tab.id, text = message.badgeText;
                chrome.webNavigation.onCommitted.addListener(function update(details) {
                    if (details.tabId == tabId) {
                        chrome.browserAction.setBadgeText({tabId: tabId, text: text});
                        chrome.webNavigation.onCommitted.removeListener(update);
                    }
                });
            }
        });
    }
});

