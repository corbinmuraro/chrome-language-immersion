	// Initialize Firebase
	var config = {
	apiKey: "AIzaSyBzJ0ZR2wWHBlZd9pyaNN0HliflTlXNEjM",
	authDomain: "cousteau-899ad.firebaseapp.com",
	databaseURL: "https://cousteau-899ad.firebaseio.com",
	storageBucket: "cousteau-899ad.appspot.com",
	messagingSenderId: "193947497319"
	};
	firebase.initializeApp(config);

function initApp() {
  // Listen for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // [START_EXCLUDE]
      document.getElementById('quickstart-button').textContent = 'Sign out';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
      // [END_EXCLUDE]
    } else {
      // Let's try to get a Google auth token programmatically.
      // [START_EXCLUDE]
      document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      document.getElementById('quickstart-account-details').textContent = 'null';
      // [END_EXCLUDE]
    }
    document.getElementById('quickstart-button').disabled = false;
  });
  // [END authstatelistener]

  document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
  // Request an OAuth token from the Chrome Identity API.
  chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      // Authrorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        if (error.code === 'auth/invalid-credential') {
          chrome.identity.removeCachedAuthToken({token: token}, function() {
            startAuth(interactive);
          });
        }
      });
    } else {
      console.error('The OAuth Token was null');
    }
  });
}

/**
 * Starts the sign-in process.
 */
function startSignIn() {
  document.getElementById('quickstart-button').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startAuth(true);
  }
}

window.onload = function() {
  initApp();
};

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