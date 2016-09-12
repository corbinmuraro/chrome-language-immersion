
function openOptions() {
	chrome.runtime.openOptionsPage();
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {type: "getCount"}, function(array) {
			if (array.length == 1)
				$('#alert').append(array.length + " phrase translated");
			else
				$('#alert').append(array.length + " phrases translated");


			for (var i = 0; i < array.length; i++)
			{    
				var html = 	'<div class="phraseGroup">' + 
								'<div>' + array[i].untranslated + '</div>' +
								'<div>' + array[i].translated + '</div>' +
							'</div>';

				$('.phraseList').append(html);
			}
		});
	});