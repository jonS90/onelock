
// Initialize a state variable. 
// The content script sends info to this eventPage, which must forward it to a new popup page.
// This variable is that info.
var infoForPopup = {
	ciphertext: "not set", 
	mode: "not set",
	node: null,
	sendResponse: null,
	keyringData: null
};


var loadKeyring = function(callback) {
	chrome.storage.sync.get("keyring", function(data) {
		var keyringData = data.keyring
		if (keyringData.length == undefined) {
			alert("new keyring made") //todo don't leave this here
			keyringData = []
		}
		if (callback)
			callback(keyringData)
	})
}
var saveKeyring = function(keyringData) {
	chrome.storage.sync.set("keyring", keyringData) 
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
	infoForPopup.keyringData = keyringData
	infoForPopup.tabId = sender.tab.id;
	console.log(infoForPopup)
	launchWindow();
}

var addContact = function(contact) {
	//todo: reject duplicate names and maybe duplicate keys.

	console.group("Adding contact to keyring");
	console.time("appended contact")

	loadKeyring(function(keyringData) {

		console.log(keyringData);

		//update in memory
		keyringData[keyringData.length] = contact;

		console.log(keyringData);

		//save to storage
		chrome.storage.sync.set({keyring: keyringData}, function() {
			console.timeEnd("appended contact")
			console.groupEnd();
		})
	})


}

var initializeSettings = function() {
	chrome.storage.sync.set({
		'displayMethod':'popup',
		'editMethod':'popup',
		'facebook':false,
		'privateKey':null,
		'publicKey':null
	});
}

var keyringData
loadKeyring(function(loadedKeyringData) {
	keyringData = loadedKeyringData
})

chrome.runtime.onMessage.addListener(dispatcher)
chrome.runtime.onInstalled.addListener(initializeSettings)