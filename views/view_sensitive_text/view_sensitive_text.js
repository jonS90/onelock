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


var testval; //debugging
var setupPopup = function(infoForPopup) {
	
	testval = infoForPopup //debugging
	popup.mode = infoForPopup.mode;
	popup.sendResponse = infoForPopup.sendResponse
	popup.tabId = infoForPopup.tabId;
	popup.node = infoForPopup.node;
	popup.plaintext = cipher.decrypt(infoForPopup.ciphertext);

	keyring.initialize(infoForPopup.keyringData)

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

			//make the bootstrap input-group popout like its supposed to
			$('.panel-body').css("background-color", "222222");

			textarea = $('textarea')

			//hack to move caret to end (http://stackoverflow.com/questions/13425363/jquery-set-textarea-cursor-to-end-of-text)
			textarea.focus().val(popup.plaintext)

			//escape key
			textarea.on("keydown", function(e) {if (e.keyCode == 27) closeWindow() })

			//ctrl-enter
			textarea.on("keypress", function(e) {if (e.charCode == 10 && e.ctrlKey == true && e.shiftKey == false && e.altKey == false) closeWindow(); })

			//fuzzy-search
			searchField = $('#contactsearch')
			searchField.on("keypress", function(e) {
				//todo: actually show this on the GUI
				console.log(searchField.val())
				console.log(keyring.fuzzySearch(searchField.val()))
			})
			break;
		default:
			$('#error').html("developer mistake...invalid mode specified").show();
	}
}

//TODO: is there a possibility for a race condition?
chrome.runtime.sendMessage({type: enums.messageType.GET_CIPHERTEXT}, setupPopup);

Mousetrap.bind('esc', function(e) {
	closeWindow()
})

// debugging
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
	console.debug("clearing timer");
	window.clearTimeout(lastTimer);
})
$('#dismiss').on('click', closeWindow)