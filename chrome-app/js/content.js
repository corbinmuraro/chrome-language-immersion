/* only need to ignore words when looking without context
var ignoreList = [
	"the",
	"and",
	"have",
	"said",
	"that",
	"this",
	"what",
	"were",
	"are",
	"was",
	"has",
	"than",
	"with",
	"from",
	"for",
	"about",
	"will",
	"would",
	"there",
	"you",
	"which"
]; 
*/

var jsonObject = {
	phraseArray : [],
	fromLang : "",	// THESE VALUES SHOULD GET FILLED BY setLanguage() 
	toLang : ""		// function at bottom of file, if they don't, ERROR
};
var textNodes = []; // gets converted into json and then sent to server
var translatedContent = []; // what gets returned from the server

// TODO: ADD USER CREATED BLACKLIST, don't run any code if the domain is on the blacklist
findText();

// uses jquery to find text on page and adds it to textNodes
// only looking at paragraph nodes
function findText()
{
	$( "p" ).each(function( index ) {
		var paragraph = $( this ).text();
		if (wordCount($( this ).text()) > 20)
		{
			textNodes.push($( this ).text());
		}
	});

	pickWords();
}

// picks phrases to translate
// builds the javascript array phraseArray with all the words
// sends number of words to display for badgetext to background.js
function pickWords()
{
	for (var i = 0; i < textNodes.length; i++)
	{
		// splits string into array of word strings
		var stringArray = textNodes[i].split(" ");

		var j = Math.floor(Math.random() * 15) + 2;
		while (j < stringArray.length)
		{
			// TODO: make translation snippets randomly varied in word length, don't cut across sentences
			// 		 at some point, make snippets logical phrases for better translation
			// 		 (e.g. "and then he said" instead of "cat and then")
			var phraseToTranslate = stringArray[j] + " " + stringArray[j+1] + " " + stringArray[j+2];
			if (validate(phraseToTranslate))
			{
				var item = {
					untranslated : phraseToTranslate,
					translated : ""
				};

				jsonObject.phraseArray.push(item);
			}

			j += Math.floor(Math.random() * 90) + 80;
		}
	}

	var arrLength = jsonObject.phraseArray.length.toString();
	chrome.runtime.sendMessage({ type: "setBadge", badgeText : arrLength });

	loadLangs();
}

// if there's nothing found to translate, don't go any further
// otherwise, pull languages from chrome storage and call ajax
function loadLangs() 
{
	if (jsonObject.phraseArray.length)
	{
		chrome.storage.sync.get({
			from: 'en',
			to: 'es',
		}, function(items) {
			jsonObject.fromLang = items.from;
			jsonObject.toLang = items.to;
			getTranslation();
		});
	}
}

// ARGUMENTS: a javascript object
// communicates with the server, adds translated text to jsonObject
// CALLBACK: replacePhrases
function getTranslation() 
{
	$.ajax({
		type: 'POST',
		url: 'https://cousteau.corbinmuraro.com:8888',
		data: JSON.stringify(jsonObject),
		contentType: 'application/json',
		dataType: "json",
		success: replacePhrases,
		error: function (xhr, status, error) {
			console.log('Error: ' + error.message);
		}
	});
}

// loops through json object returned, calling replaceInDOM on each
function replacePhrases(translatedArray)
{	
	translatedContent = translatedArray;

	for (var j = 0; j < translatedContent.length; j++)
	{
		replaceInDOM(translatedContent[j].untranslated, translatedContent[j].translated);
	}
}

// takes untranslated and translated string
// replaces instances of untranslated with translated on DOM
function replaceInDOM(untranslated, translated)
{
	var untranslatedRegex = new RegExp('\\b' + untranslated + '\\b');

	var mouseoverUntranslated = untranslated; // used for replacement
	var mouseoverTranslated = translated;

	var style = "style='text-decoration: underline'";
	var onmouseover = "onmouseover=\"this.innerHTML ='" + mouseoverUntranslated + "';\"";
	var onmouseout = "onmouseout=\"this.innerHTML ='" + mouseoverTranslated + "';\"";

	var translatedString = "<span data-untranslated='" + untranslated + "' data-translated='" + translated + "'>" + translated + "</span>";

	$("body *").replaceText(untranslatedRegex, translatedString);

	// $("p").html(function(i, text) {
	// 	return text.replace(untranslatedRegex, translatedString);
	// });
 }

// ARGUMENTS: a string
// RETURNS: the number of words in the string
function wordCount(str) 
{ 
	return str.split(" ").length;
}

// returns valid if phrase has no strange characters
// TODO: add validation for non-latin based languages
function validate(phrase)
{
	var re = new RegExp("^[a-z ,'’-]{6,}$"); // only lowercase, space, comma, etc, 6+ characters
	if (!re.test(phrase) || phrase.indexOf('undefined') !== -1)
	{
		console.log("INVALD " + phrase);
		return false;
	}
	else
	{
		console.log("VALID " + phrase);
	}

	return true;
}

/* =============================================== */

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case "getCount":
            	console.log(translatedContent);
                sendResponse(translatedContent);
                break;

            case "untranslateAll":
            	var allUntranslated = true;
            	$("span[data-untranslated]").each(function() {
            		var untranslated = $(this).attr('data-untranslated');
            		console.log(untranslated);
            		var spanText = $(this).text();
            		console.log(spanText);
            		if (spanText != untranslated)
            			allUntranslated = false;
            	});

            	if (allUntranslated)
            		translateAll();
            	else
           			untranslateAll();

				break;

            default:
                console.error("Unrecognised message: ", message);
        }
    }
);

// all words --> untranslated version
function untranslateAll() {	
	$("span[data-untranslated]").each(function(){
		var untranslatedData = $(this).attr('data-untranslated');
		$(this).text(untranslatedData);
	});
}

// all words --> translated version
function translateAll() {
	$("span[data-translated]").each(function(){
		var translatedData = $(this).attr('data-translated');
		$(this).text(translatedData);
	});
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
