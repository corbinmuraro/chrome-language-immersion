/* When the browser-action button is clicked... */
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({
        'url': "chrome://extensions/?options=" + chrome.runtime.id,
        'selected': true
    });
});

// If all works fine, just remove this code
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
//     if(changeInfo && changeInfo.status == "complete"){
//         chrome.tabs.executeScript(tabId, {file: "jquery.js"}, function(){
//             chrome.tabs.executeScript(tabId, {file: "script.js"});
//         });
//     }
// });

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	console.log('in background listener');
	// It is recommended to add a message type so your code
	//   can be ready for more types of messages in the future
	switch(message.type) {
		case "updateBadge":
			chrome.browserAction.setBadgeText({text: message.length});
			break;
		default:
			console.warn("Unrecognized message type: " + message.type);
			break;
		}
});