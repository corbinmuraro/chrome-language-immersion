

var phrases = [];


$(function() {
    $('.translated').each(function() {
		phrase = $(this);

		phrases.push(phrase);
		phrase.css('background-color','yellow');
	});

    shuffle(phrases);

	(function phrasesLoop (i) {
		setTimeout(function () {
			replaceText(phrases[i]);
			if (i < phrases.length - 1) {
				i++;
				phrasesLoop(i);		//  decrement i and call myLoop again if i > 0
			} 
		}, 220);
	})(0);
});




function replaceText(node) {
    var contentArray = node.data('translation').split(""),
        current = 0;
    node.text("");
    setInterval(function() {
        if(current < contentArray.length) {
            node.text(node.text() + contentArray[current++]);
        }
        else {
        	// node.animate({ 'background-color': 'rgba(0, 0, 0, 0.1)' },1000);
        }
    }, 70);
}


function shuffle(arr) {
    var j, x, i;
    for (i = arr.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = arr[i - 1];
        arr[i - 1] = arr[j];
        arr[j] = x;
    }
}