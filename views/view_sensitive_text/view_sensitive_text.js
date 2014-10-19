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

var SEARCH_FIELD = $('#contact-input')
var TEXTAREA = $('#text-input');


closeWindow = function() {

	if (popup.mode == "edit") {
		var infoForPage = {
			type: "return ciphertext",
			nodeId: popup.node.id,
			ciphertext: cipher.encrypt(TEXTAREA.val(), [SEARCH_FIELD.val()])
		}

		chrome.tabs.sendMessage(popup.tabId, infoForPage);
	}

	chrome.windows.remove(popup.window);
}


// setupPopup() will be used as a callback, but it needs access to these classes. Instantiate here.
var keyring = new Keyring()
var Cipher_ = Cipher; 

var setupPopup = function(infoForPopup) {
	try {
		console.group("Received from background");
		console.log(infoForPopup);
		console.groupEnd()
		popup.mode = infoForPopup.mode;
		popup.sendResponse = infoForPopup.sendResponse
		popup.tabId = infoForPopup.tabId;
		popup.node = infoForPopup.node;
	
		keyring = new Keyring();
		keyring.loadData(infoForPopup.keyringData)
		cipher = new Cipher(keyring, infoForPopup.ownerName)
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
				$('#edit').append("<textarea id='text-input' class='form-control' rows='4'>"+"</textarea>")
				TEXTAREA = $(TEXTAREA.selector); //refresh jQuery snapshot (since we dynamically added something) 
	
				//make the bootstrap input-group popout like its supposed to
				$('.panel-body').css("background-color", "222222");
	
				SUGGESTION_BOX = $('ul')
	
				//hack to move caret to end (http://stackoverflow.com/questions/13425363/jquery-set-textarea-cursor-to-end-of-text)
				TEXTAREA.focus().val(popup.plaintext)
	
				//escape key
				TEXTAREA.on("keydown", function(e) {if (e.keyCode == 27) closeWindow() })
	
				//ctrl-enter
				TEXTAREA.on("keypress", function(e) {if (e.charCode == 10 && e.ctrlKey == true && e.shiftKey == false && e.altKey == false) closeWindow(); })
	
				SEARCH_FIELD.autocomplete({source: keyring.getNames()})

				break;
			default:
				$('#error').html("developer mistake...invalid mode specified").show();
		}
	}
	catch (e) {
		console.groupEnd();
		console.error(e.stack)
		alert(e.stack)
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
			// TODO uncomment!!!!
			//closeWindow()
		}, 5000)
	}
);
$(window).focus(function() {
	console.debug("clearing timer");
	window.clearTimeout(lastTimer);
})
$('#dismiss').on('click', closeWindow)