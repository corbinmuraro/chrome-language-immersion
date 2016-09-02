var fromLang = "en";
var toLang = "es";

var socket = io('http://ec2-54-191-234-133.us-west-2.compute.amazonaws.com:8888');

walk(document.body);

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
			// console.log(node.nodeValue);
			if (wordCount(node.nodeValue) > 15) // only use sizable portions of text
			{
				getTranslations(node);
			}

			break;
		}
}

function getTranslations(node)
{
	var stringArray = node.nodeValue.split(" ");

	var i = Math.floor(Math.random() * 10) + 5;
	while (i < stringArray.length)
	{
		// TODO: make translation snippets randomly varied in length (maybe 1-3 words?)
		// TODO: make sure that translation snippet doesn't cut across sentences
		var translationSnippets = [];
		translationSnippets[0] = stringArray[i];

		// use the following line when using multiple word phrases to join them into a string
		// var preTranslatedSnippet = translationSnippets.join(" ");

		socket.emit('pre-translate', {
			value: translationSnippets[0],
			from: fromLang,
			to: toLang
		});

		socket.on('post-translate', function(translatedText){
			// this logic only works for single word phrases
			console.log(i);
			stringArray[i] = translatedText.value;
		});
		

		i += Math.floor(Math.random() * 20) + 5;

		console.log(stringArray);
		node.nodeValue = stringArray.join(" ");

		console.log(node.nodeValue);
	}
}

function 

function displayTranslations(node, translatedText, stringArray)
{

}

function wordCount(str) 
{ 
	return str.split(" ").length;
}


