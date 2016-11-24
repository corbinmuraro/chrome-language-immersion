$(document).ready(function() {
	$('#options').click( function() {
		chrome.runtime.openOptionsPage();
	});

	$('#toggle').click(function() {
		
		removeFromDomains();
	});

	setBackground();
});

function setBackground() {
	var today = new Date();
	var curHr = today.getHours();

	if (curHr > 18)
	{
		$('body').css('background-image', 'linear-gradient(-180deg, #BDD7D9 0%, #527174 100%)');
	}
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {type: "getCount"}, function(array) {
			if ((typeof array == "undefined" || !(array instanceof Array)))
				return;

			if (array.length == 1)
				$('#alert').append(array.length + " phrase translated");
			else
				$('#alert').append(array.length + " phrases translated");


			for (var i = 0; i < array.length; i++)
			{    
				var html = 	'<div class="phraseGroup">' + 
								'<div class="col1">' + array[i].untranslated + '</div>' +
								'<div class="col2">' + array[i].translated + '</div>' +
							'</div>';

				$('.phraseList').append(html);
			}
		});
	});

function removeFromDomains() {
	
}