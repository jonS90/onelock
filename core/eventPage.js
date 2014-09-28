var TESTING = true

// Initialize a state variable. 
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

var loadStuff = function(callback) {
	console.group("Loading keyring")
	chrome.storage.sync.get(["keyringData", "ownerName"], function(data) {
		ownerName = data.ownerName;						
		var keyringData = data.keyringData;							console.log(keyringData);

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
	})
}


var dispatcher = function(message, sender, sendResponse) {
	switch(message.type) {
	case (enums.messageType.SHOW_PAGEACTION):
		//from contentScript to eventPage
		showPageAction()
		break;
	case (enums.messageType.DECRYPT_AND_SHOW):
		//from contentScript to eventPage
		showPlaintext(message, sender, sendResponse)
		break;
	case (enums.messageType.GET_CIPHERTEXT):
		//from view_sensitive_text popup to eventPage
		sendResponse(infoForPopup)
		console.log("Sent info to popup")
		console.groupEnd("Launch sensitive-text viewer")
		break;
	case (enums.messageType.ADD_CONTACT):
		//from add_contact form to eventPage
		addContact(message)
		break;
	default:
		alert("developer's mistake: event page doesn't know what to do with this type: " + message.type);
	}
}

var showPageAction = function() {
	chrome.tabs.query(
        {currentWindow: true, active: true},
        function(tabArray) {
            if (tabArray && tabArray[0])
                chrome.pageAction.show(tabArray[0].id);
        }
    );
}

var showPlaintext = function(message, sender, sendResponse) {
	console.group("Launch sensitive-text viewer")
	var launchWindow = function() {
		var w = 405 
		var h = (message.editable) ? 300 : 250
		var left = (window.screen.width)-((w)+10);
		var top = 25+10; //(window.screen.height/2)-(h/2);
		var url = chrome.extension.getURL('views/view_sensitive_text/view_sensitive_text.html')
		var options = {url: url, width: w, height: h, left: left, top: top, focused:true, type:"popup"};
		chrome.windows.create(options);
	}

	infoForPopup.mode = (message.editable) ? "edit" : "show";
	infoForPopup.ciphertext = message.ciphertext;
	infoForPopup.node = message.node
	infoForPopup.sendResponse = sendResponse
	infoForPopup.keyringData = keyring.getData();
	infoForPopup.ownerName = ownerName;
	infoForPopup.tabId = sender.tab.id;
	console.log(infoForPopup)
	launchWindow();
}

var addContact = function(contact) {
	//todo: reject duplicate names and maybe duplicate keys.
	try{
		console.group("Adding contact to keyring");
		getKeyring(function(keyring) {
			var success = keyring.add(contact.name, contact)
			console.log("Added contact in memory: " + success)
			// 
			throw "not implemented"
			console.log("Saved updated keyring")
			console.groupEnd()
		})
	}
	catch (e) {
		console.error(e.stack)
		alert(e.stack)
	}

}

var initializeSettingsForFirstLaunch = function(callback) {
	console.log("Initializing first-launch settings");
	var settings = {
		'displayMethod':'popup',
		'editMethod':'popup',
		'facebook':false,
		'privateKey':null,
		'publicKey':null
	};
	if (TESTING) {
		settings['ownerName'] = "Jon Smithers";
		console.log("(testing mode on)")
	}
	chrome.storage.sync.set(settings, callback);
}

var setTestSettings = function(callback) {
	var settings = {
		'keyringData': Keyring.getTestKeyringAlice().getData(),
		'ownerName': "Alice",
		'displayMethod':'popup',
		'editMethod':'popup',
		'facebook':false,
		'privateKey':null,
		'publicKey':null
	}
	chrome.storage.sync.set(settings, callback);
	console.log("Initialized settings for TESTING");

}

/******************************************
* Stop defining stuff and start doing stuff
*******************************************/

if (!TESTING) 
	loadStuff();
else
	setTestSettings(
		loadStuff
	);

chrome.runtime.onMessage.addListener(dispatcher)
chrome.runtime.onInstalled.addListener(function() {
	var createProperties = {url: chrome.extension.getURL('views/setup/setup.html')};
	chrome.tabs.create(createProperties);
	// (onInstalled includes updates)
})