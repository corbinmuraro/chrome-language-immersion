
function saveSettings()
{
	var fromLang = document.getElementById('fromLang').value;
	var toLang = document.getElementById('toLang').value;
	console.log(fromLang + "    " + toLang);

	chrome.storage.sync.set({
        from: fromLang,
        to: toLang
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
    });
}


// restores visible options using prefs stored in chrome.storage
function restoreSettings()
{
    chrome.storage.sync.get({
        from: 'en', 		// default
        to: 'es', 			// default
    }, function(items) {
        document.getElementById('fromLang').value = items.from;
        document.getElementById('toLang').value = items.to;
    });
}

document.addEventListener('DOMContentLoaded', restoreSettings);
document.getElementById('save').addEventListener('click', saveSettings);
