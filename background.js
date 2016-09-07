// /* When the browser-action button is clicked... */
// chrome.browserAction.onClicked.addListener(function(tab) {
//     chrome.tabs.create({
//         'url': "chrome://extensions/?options=" + chrome.runtime.id,
//         'selected': true
//     });
// });


// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
//     if(changeInfo && changeInfo.status == "complete"){
//         chrome.tabs.executeScript(tabId, {file: "jquery.js"}, function(){
//             chrome.tabs.executeScript(tabId, {file: "script.js"});
//         });
//     }
// });

// function loadLangs() {
//     chrome.storage.sync.get({
//     	from: 'en',
//     	to: 'es',
//     }, function(items) {
//     	console.log('at least?');	
//         setLanguage(items.from, items.to);
//     });
// }


var jsonObject = {
	wordArray : [],
	fromLang : "en",
	toLang : "es",
};

var textNodes = [];

// loadLangs();
walk(document.body);
buildjsObject();
getTranslation();


function walk(node)
{
	var child, next;
	switch ( node.nodeType )
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
				while ( child ) 
				{
					next = child.nextSibling;
					walk(child);
					child = next;
				}
			break;
		case 3: // Text node
			if (wordCount(node.nodeValue) > 12) // only use sizable portions of text
			{
				console.log('wat');
				textNodes.push(node);
			}

			break;
	}
}


// finds words to translate
// builds the javascript array wordArray with all the words,
// leaving the translated strings empty
function buildjsObject(node)
{
	for (var i = 0; i < textNodes.length; i++)
	{
		// splits string into array of word strings
		var stringArray = textNodes[i].nodeValue.split(" ");

		var j = Math.floor(Math.random() * 10) + 5;
		while (j < stringArray.length)
		{
			// TODO: make translation snippets randomly varied in length (maybe 1-3 words?)
			// TODO: make sure that translation snippet doesn't cut across sentences
			var wordToTranslate = stringArray[j];

			// use the following line when using multiple word phrases to join them into a string
			// var preTranslatedSnippet = translationSnippets.join(" ");

			/*
				WHAT I NEED TO DO:
		
				FIND ALL THE SPOTS TO REPLACE IN ONE FUNCTION, SAVE THEM IN GLOBAL ARRAY

				THEN, ONCE ALL THAT SHIT IS DONE, MAKE ONE AJAX CALL WITH ALL PARAMETERS

				LASTYLY, REPLACE THE TRANSLATED TEXT (MAYBE AS CALLBACK FROM AJAX FUNCTION ^)
			*/

	        var item = {
	        	untranslated : wordToTranslate,
	        	translated : ""
	        };

	        jsonObject.wordArray.push(item);
	        console.log(item.untranslated);



			j += Math.floor(Math.random() * 10) + 5;
		}
	}
}

// ARGUMENTS: a javascript object
// communicates with the server, adds translated text to JSON object
// CALLBACK: replaceWords
function getTranslation() 
{
	console.log('ajax call');

    $.ajax({
    	type: 'POST',
        url: 'https://languageimmersion.tk:8888',
        data: JSON.stringify(jsonObject),
        contentType: 'application/json',
        dataType: "json",
        success: replaceWords,
        error: function (xhr, status, error) {
            console.log('Error: ' + error.message);
        }
    });
}

function replaceWords(translatedArray)
{
	console.log('callback!');
	for (var i = 0; i < textNodes.length; i++)
	{
		var v = textNodes[i].nodeValue;

		for (var j = 0; j < translatedArray.length; j++)
		{
			v = v.replace(translatedArray[j].untranslated, translatedArray[j].translated);
			
			textNodes[i].nodeValue = v;
		}
	}
}

// takes languages as inputs
// assigns lanuages to the jsonObject.
function setLanguage(fromLang, toLang)
{
	jsonObject.fromLang = fromLang;
	jsonObject.toLang = toLang;
}


// ARGUMENTS: a string
// RETURNS: the number of words in the string
function wordCount(str) 
{ 
	return str.split(" ").length;
}



// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// WEB SOCKET translation function
// %%%%%%%%%%%%%%%%%
// function getTranslation(arr, pos, snippet)
// {
// 		console.log(arr + "   " + pos + "   " + snippet);

// 		socket.emit('pre-translate', {
// 			value: snippet,
// 			from: fromLang,
// 			to: toLang
// 		});

// 		socket.on('post-translate', function(translatedText){
// 			// this logic only works for single word phrases
// 			console.log(arr);
// 			console.log(pos);
// 			console.log(translatedText.value);
// 			arr[pos] = translatedText.value;
// 			// console.log(arr);
// 		});
// }
