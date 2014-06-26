// alert("event page load")




var infoForPopup = {
	ciphertext: "not set", 
	mode: "not set",
	node: null,
	sendResponse: null
};


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



	switch(message.type) {
	case "retrieve ciphertext":
		// console.log(infoForPopup);
		sendResponse(infoForPopup);
		break;
	case "decrypt and show":
		infoForPopup.mode = "show";
		infoForPopup.ciphertext = message.ciphertext;
		infoForPopup.node = message.node
		launchWindow();
		break;
	case "decrypt and edit":
		infoForPopup.mode = "edit";
		infoForPopup.ciphertext = message.ciphertext;
		infoForPopup.node = message.node
		infoForPopup.sendResponse = sendResponse
		infoForPopup.tabId = sender.tab.id;
		launchWindow();
		// return 1; // http://stackoverflow.com/questions/20077487/chrome-extension-message-passing-between-extensionbackground-and-content-scrip
		//              this did not work.....whatevs
		break;
	default:
		alert("event page doesn't know what to do with this type: " + message.type);
	}
}


var initialize = function() {
	chrome.storage.local.set({
		'displayMethod':'popup',
		'editMethod':'popup',
		'facebook':false
	});
}

chrome.runtime.onMessage.addListener(showPlaintext)
chrome.runtime.onInstalled.addListener(initialize)