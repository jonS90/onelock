decryptText = function(ciphertext) {
	    var password = "sdflkjweljsflkjsdflkjsdflkjsdfkljsdflkjsdflkj";
	    var plaintext  = CryptoJS.AES.decrypt(ciphertext, password).toString(CryptoJS.enc.Utf8);
	    if (plaintext == "") plaintext = "decryption failed"
	    return plaintext
	}

encryptText = function(plaintext) {
    var password = "sdflkjweljsflkjsdflkjsdflkjsdfkljsdflkjsdflkj";
    var ciphertext  = CryptoJS.AES.encrypt(plaintext, password).toString();
    return ciphertext
}

var popup = {
	mode: {},
	sendResponse: {},
	node: {},
	plaintext: {},
	window: {},
	tabId: 0 //the source tab, where our text came from
}

var popupWindow; 
chrome.windows.getCurrent(function(w) {
	popup.window = w.id;
});	
closeWindow = function() {
	if (popup.mode == "edit") {
		var infoForPage = {
			type: "return ciphertext",
			nodeId: popup.node.id,
			ciphertext: encryptText($('textarea').val())
		}

		chrome.tabs.sendMessage(popup.tabId, infoForPage);
	}

	chrome.windows.remove(popup.window);
}


var testval; 
var setupPopup = function(infoForPopup) {
	
	testval = infoForPopup
	popup.mode = infoForPopup.mode;
	popup.sendResponse = infoForPopup.sendResponse
	popup.tabId = infoForPopup.tabId;
	popup.node = infoForPopup.node;
	// alert("popup getting: " + infoForPopup);
	popup.plaintext = decryptText(infoForPopup.ciphertext);

	$('.toggleable').hide();
	switch(popup.mode) {
		case "show":
			$('#show').html("<u>decryption</u><br><p>" + popup.plaintext + "</p>").show();
			break;
		case "edit":
			$('#edit').html("<u>edit decrypted text</u><p>").show();
			$('#edit').append("<textarea autofocus='true'>"+popup.plaintext+"</textarea>")
			$('textarea').on("keydown", function(e) {if (e.keyCode == 27) closeWindow() })
			break;
		default:
			$('#error').html("something ``went wrong....invalid mode specified").show();
	}
}
chrome.runtime.sendMessage({type: "retrieve ciphertext"}, setupPopup);


Mousetrap.bind('ctrl+enter', function(e) {
	alert("control enter");
})

Mousetrap.bind('esc', function(e) {
	closeWindow()
})

Mousetrap.bind('alt+t', function(e) {
	console.log(testval)
})

// $(window).blur(closeWindow); //http://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active