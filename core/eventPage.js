var TESTING = false;

/*******************************************
 * State Variables
 *******************************************/

// The content script sends info to this eventPage, which must forward it to a new popup page.
// This variable is that info.
var infoForPopup = {
	ciphertext: "not set",
	mode: "not set",
	node: null,
	sendResponse: null,
};

var keyring;
var ownerName;

/*******************************************
 * PrivateMethods
 *******************************************/

var loadStuff = function(callback) {
	console.group("Loading keyring");
	chrome.storage.local.get(["keyringData", "ownerName"], function(data) {
		ownerName = data.ownerName;
		var keyringData = data.keyringData;

		keyring = new Keyring();

		// first launch
		if (!keyringData) {
			console.log("First launch detected");
			keyring.initialize();

			initializeSettingsForFirstLaunch(callback);

		// normal launch
		} else {
			keyring.loadData(keyringData);
			console.log("Loaded keyring data");
			if (callback)
				callback(keyringData);

			console.assert(ownerName, "Owner must be specified");
		}
		console.groupEnd("Loading keyring");
	});
};

var saveStuff = function(callback) {
	console.group("Saving stuff");
	console.log("keyring");
	chrome.storage.local.set({
		keyringData: keyring.getData()
	}, function() {
		console.groupEnd("Saving stuff");
		if (callback) {
			callback();
		}
	});
};


/**
 * All messages sent to the extension are dispatched here.
 * @param  {any}           message      The message sent by the calling script.
 * @param  {MessageSender} sender       
 * @param  {func}          sendResponse Function to call (at most once) when you
 *     have a response. The argument should be any JSON-ifiable object. If you
 *     have more than one onMessage listener in the same document, then only one
 *     may send a response. This function becomes invalid when the event
 *     listener returns, unless you return true from the event listener to
 *     indicate you wish to send a response asynchronously (this will keep the
 *     message channel open to the other end until sendResponse is called).
 */
var dispatchToMethod = function(message, sender, sendResponse) {
	try{
		switch(message.type) {
		case (enums.messageType.SHOW_PAGEACTION):
			//from contentScript to eventPage
			showPageAction();
			break;
		case (enums.messageType.DECRYPT_AND_SHOW):
			//from contentScript to eventPage
			showPlaintext(message, sender, sendResponse);
			break;
		case (enums.messageType.GET_CIPHERTEXT):
			//from view_sensitive_text popup to eventPage
			sendResponse(infoForPopup);
			console.log("Sent info to popup");
			console.groupEnd("Launch sensitive-text viewer");
			break;
		case (enums.messageType.GET_PUBLICKEY):
			getPublickey(message, sender, sendResponse);
			break;
		case (enums.messageType.ADD_CONTACT):
			//from add_contact form to eventPage
			addContact(message, sender, sendResponse);
			break;
		default:
			alert("developer's mistake: event page doesn't know what to do with this type: " + message.type);
		}
		return true; //don't cancel out any asynchronous sendResponses http://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
	} catch(e) {
		console.error(e.stack);
		alert(e.stack);
	}
};

var showPageAction = function() {
	chrome.tabs.query(
        {currentWindow: true, active: true},
        function(tabArray) {
            if (tabArray && tabArray[0])
                chrome.pageAction.show(tabArray[0].id);
        }
    );
};

var showPlaintext = function(message, sender, sendResponse) {
	console.group("Launch sensitive-text viewer");
	var launchWindow = function() {
		var w = 405;
		var h = (message.editable) ? 300 : 250;
		var left = (window.screen.width)-((w)+10);
		var top = 25+10; //(window.screen.height/2)-(h/2);
		var url = chrome.extension.getURL('views/view_sensitive_text/view_sensitive_text.html');
		var options = {url: url, width: w, height: h, left: left, top: top, focused:true, type:"popup"};
		chrome.windows.create(options);
	};

	infoForPopup.mode = (message.editable) ? "edit" : "show";
	infoForPopup.ciphertext = message.ciphertext;
	infoForPopup.node = message.node;
	infoForPopup.sendResponse = sendResponse;
	infoForPopup.keyringData = keyring.getData();
	infoForPopup.ownerName = ownerName;
	infoForPopup.tabId = sender.tab.id;
	console.log(infoForPopup);
	launchWindow();
};

var getPublickey = function(message, sender, sendResponse) {
	console.log("Request for MY public key");
	sendResponse(utils.exportKey(keyring.get(ownerName)));
};

var addContact = function(message, sender, sendResponse) {
	var contact = utils.importKey(message.contact);
	var overwrite = message.overwrite;
	var signedName = contact.signedName;
	console.group("Adding contact to keyring");
	if (overwrite && keyring.get(signedName)) {
		keyring.remove(signedName);
	}
	var success = keyring.add(signedName, contact);
	console.log("Added contact in memory: " + success);
	saveStuff(function() {
		console.log("Saved updated keyring");
		console.groupEnd("Adding contact to keyring");
		sendResponse({success: success});
	});
};

var initializeSettingsForFirstLaunch = function(callback) {
	console.log("Initializing first-launch settings");
	var settings = {
		'displayMethod':'popup',
		'editMethod':'popup',
		'facebook':false,
	};
	if (TESTING) {
		settings.ownerName = "Jon Smithers";
		console.log("(testing mode on)");
	}
	chrome.storage.local.set(settings, callback);
};

var setTestSettings = function(callback) {
	var settings = {
		'keyringData': Keyring.getTestKeyringAlice().getData(),
		'ownerName': "Alice",
		'displayMethod':'popup',
		'editMethod':'popup',
		'facebook':false,
		'privateKey':null,
		'publicKey':null
	};
	chrome.storage.local.set(settings, callback);
	console.log("Initialized settings for TESTING");

};

/*******************************************
 * Stop defining and actually do stuff
 *******************************************/

if (!TESTING) 
	loadStuff();
else
	setTestSettings(
		loadStuff
	);

chrome.runtime.onMessage.addListener(dispatchToMethod);
chrome.runtime.onInstalled.addListener(function() { // (onInstalled includes updates)

	chrome.storage.local.get("ownerName", afterStorageFetch);
	function afterStorageFetch(items) {
		if (!items.ownerName) {
			var createProperties = {url: chrome.extension.getURL('views/setup/setup.html')};
			chrome.tabs.create(createProperties);
		}
	}
	
});