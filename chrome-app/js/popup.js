$(document).ready(function() {
	// $('#options').click( function() {
	// 	chrome.runtime.openOptionsPage();
	// });

	// $('#toggle').click(function() {
	// 	removeFromDomains();
	// });

	$('.translate-all-wrap').click(function() {
		console.log('clicked');
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {type: "untranslateAll"}, function(response) {
		    console.log('response recieved');
		  });
		});


	});

	$('.row1').click(function() {
		var row2 = $(this).siblings('.row2');

		// untranslate()

		console.log($(this).offset().top);

		if ($(this).offset().top === 0) {
			$(this).siblings('.marker').animate({
				height: $(this).outerHeight(),
				top: 0
			}, 160);
		}
	});

	$('.row2').click(function() {
		var row1 = $(this).siblings('.row1');

		if ($(this).offset().top !== 0) {

			// translate()

			$(this).siblings('.marker').animate({
				height: $(this).outerHeight(),
				top: $(this).offset().top - row1.offset().top
			}, 	160);
		}
	});

	// $("#fromLang").change(function() {
	// 	setSelectWidth("#fromLang");
	// 	saveSettings();
	// });

	// $("#toLang").change(function() {
	// 	setSelectWidth("#toLang");
	// 	saveSettings();
	// });
});

function slideDown(slider) {

}

function slideUp(slider) {

}


chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {type: "getCount"}, function(array) {
			if ((typeof array == "undefined" || !(array instanceof Array)))
				return;

			// if (array.length == 1)
			// 	$('#alert').append(array.length + " phrase translated");
			// else
			// 	$('#alert').append(array.length + " phrases translated");


			for (var i = 0; i < array.length; i++)
			{    
				var html = 	'<div class="phraseGroup">' +
								'<div class="marker"></div>' +
								'<div class="row1">' + array[i].untranslated + '</div>' +
								'<hr>' +
								'<div class="row2">' + array[i].translated + '</div>' +
							'</div>';

				$('.phraseList').append(html);
			}
		});
	});

// function removeFromDomains() {
	
// }

// // restores visible options using prefs stored in chrome.storage
// function restoreSettings()
// {
// 	chrome.storage.sync.get({
// 		from: 'en',         // default
// 		to: 'es',           // default
// 		array: []			// default
// 	}, function(items) {
// 		document.getElementById('fromLang').value = items.from;
// 		document.getElementById('toLang').value = items.to;

// 		// for (var i = 0; i < blacklistArray.length; i++)
// 		// {
// 		// 	addTask(blacklistArray[i]);
// 		// }
// 	});
// }

// // saves current fromLang to toLang settings
// function saveSettings()
// {
// 	var fromLang = document.getElementById('fromLang').value;
// 	var toLang = document.getElementById('toLang').value;

// 	chrome.storage.sync.set({
// 		from: fromLang,
// 		to: toLang,
// 	});
// }

// // adjusts width of select element to the width of the currently selected option on call
// function setSelectWidth(select) {
// 	$('#templateOption').text( select.val() );
// 	sel.width( $('#template').width() * 1.03 );
// }

// // on load, restore settings saved in chrome storage
// document.addEventListener('DOMContentLoaded', restoreSettings);