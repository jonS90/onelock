// alert("event page load")



// A state variable. The content script sends info to this eventPage, which must forward it to a new popup page.
var infoForPopup = {
	ciphertext: "not set", 
	mode: "not set",
	node: null,
	sendResponse: null
};


var dispatcher = function(message, sender, sendResponse) {
	switch(message.type) {
	case (enums.messageType.DECRYPT_AND_SHOW):
		//from contentScript to eventPage
		showPlaintext(message, sender, sendResponse)
		break;
	case (enums.messageType.GET_CIPHERTEXT):
		//from safe_view popup to eventPage
		sendResponse(infoForPopup);
		break;
	case (enums.messageType.ADD_CONTACT):
		//from add_contact form to eventPage
		throw "to implement" //TODO implement
		break;
	default:
		alert("developer's mistake: event page doesn't know what to do with this type: " + message.type);
	}
}


var showPlaintext = function(message, sender, sendResponse) {
	var launchWindow = function() {
		var w = 405 //291;
		var h = 250 //180;
		var left = (window.screen.width)-((w)+10);
		var top = 25+10; //(window.screen.height/2)-(h/2);
		var url = chrome.extension.getURL('safe_view/view.html')
		var options = {url: url, width: w, height: h, left: left, top: top, focused:true, type:"popup"};
		console.log(options);
		chrome.windows.create(options);
	}

	infoForPopup.mode = (message.editable) ? "edit" : "show";
	infoForPopup.ciphertext = message.ciphertext;
	infoForPopup.node = message.node
	infoForPopup.sendResponse = sendResponse
	console.debug(sender);
	infoForPopup.tabId = sender.tab.id;
	launchWindow();
}

var addContact = function(contact) {

}

var initialize = function() {
	chrome.storage.local.set({
		'displayMethod':'popup',
		'editMethod':'popup',
		'facebook':false,
		'privateKey':null,
		'publicKey':null
	});
}

chrome.runtime.onMessage.addListener(dispatcher)
chrome.runtime.onInstalled.addListener(initialize)