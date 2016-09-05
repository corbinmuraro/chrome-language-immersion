var config = require('./config');

var MsTranslator = require('mstranslator');
// Second parameter to constructor (true) indicates that
// the token should be auto-generated.
var client = new MsTranslator({
  client_id: config.client_id,
  client_secret: config.client_secret
}, true);


var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', function (req, res, next) {
	res.setHeader('Content-Type', 'application/json');

	var wordArray = req.body.wordArray;
	var wordsRemaining = wordArray.length;

	for (var i = 0; i < wordArray.length; i++)
	{
		var params = {
			text: wordArray[i].untranslated,
			from: req.body.fromLang,
			to: req.body.toLang
		};
		
		function outer(params, i, callback)
		{
			client.translate(params, function(err,result)
			{
				wordArray[i].translated = result;
				wordsRemaining--;
				callback();
			});
		}

		outer(params,i,checkWordsRemaining);
	}

	function checkWordsRemaining()
	{
		if (wordsRemaining === 0) 
			res.send(wordArray);
	}
});



app.listen(8888, function () {
	console.log('Example app listening on port 8888!');
});






// . • * ° SOCKET MAGIC ° * • . //

// var io = require('socket.io').listen(8888);

// io.sockets.on('connection', function(socket) {

//  socket.on('pre-translate', function(data) {

//      console.log(data.value + "  " + data.from + "  " + data.to);

//      var params = {
//          text: data.value,
//          from: data.from,
//          to: data.to
//      };

//      var translatedText = "";

//      client.translate(params, function(err, data) {
//          console.log(data);

//          socket.emit('post-translate', {
//              value: data
//          });
//      });
//  });
// });
