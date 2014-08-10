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
			ciphertext: cipher.encrypt($('textarea').val())
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
	// popup.plaintext = decryptText(infoForPopup.ciphertext);
	popup.plaintext = cipher.decrypt(infoForPopup.ciphertext);


	$('.toggleable').hide();
	switch(popup.mode) {
		case "show":
			$('#heading').text('decryption')
			$('#show').html("<p>" + popup.plaintext.replace(/\n/g, "<br>") + "</p>").show();
			break;
		case "edit":
			$('#heading').text('edit decrypted text')
			$('#edit').show();
			$('#edit').append("<textarea class='form-control' rows='4'>"+"</textarea>")
			//hack to move caret to end (http://stackoverflow.com/questions/13425363/jquery-set-textarea-cursor-to-end-of-text)
			$('textarea').focus().val(popup.plaintext)
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


//close window automatically after lost focus
var lastTimer = null;
$(window).blur(
	function() {
		closingWindow = true;
		lastTimer = window.setTimeout(function() {
			closeWindow()
		}, 5000)
	}
);
$(window).focus(function() {
	console.log("clearing timer");
	window.clearTimeout(lastTimer);
})
$('#dismiss').on('click', closeWindow)