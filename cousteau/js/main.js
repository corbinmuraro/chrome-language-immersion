

var phrases = [];


$(function() {
    $('.translated').each(function() {
		phrase = $(this);
		phrase.addClass('beforeAnimation');
        phrases.push(phrase);
	});

    // shuffle(phrases);

    var count = 0;
    var i = setInterval(function(){
	    replaceText(phrases[count]);

	    count++;
	    if(count === phrases.length) {
	        clearInterval(i);
	    }
	}, 800);
});

// replaces 
function replaceText(phrase) {
    var contentArray = phrase.data('translation').split(""),
        current = 0;
    phrase.text("");
    setInterval(function() {
        if(current < contentArray.length) {
            phrase.text(phrase.text() + contentArray[current++]);
        }
        else {
        	phrase.removeClass('beforeAnimation');
        	phrase.addClass('afterAnimation');
        }
    }, 70);
}

// // utility function to shuffle array order
// function shuffle(arr) {
//     var j, x, i;
//     for (i = arr.length; i; i--) {
//         j = Math.floor(Math.random() * i);
//         x = arr[i - 1];
//         arr[i - 1] = arr[j];
//         arr[j] = x;
//     }
// }