var TESTING = false;
var SEARCH_FIELD = $('#contact-input');
var TEXTAREA = $('#text-input');

var stateVars = { //just a bunch of global variables for the whole page
	mode: {},
	sendResponse: {},
	node: {},
	plaintext: {},
	window: {},
	tabId: 0 //the source tab, where our text came from
};

// general setup 
{
	Mousetrap.bind('esc', function(e) {
		closeWindow();
	});
	
	//close window automatically after lost focus
	var lastTimer = null;
	$(window).blur(
		function() {
			closingWindow = true;
			lastTimer = window.setTimeout(afterTimeout, 5000);
			function afterTimeout() {
				if (!TESTING) {
					closeWindow();
				}
			}
		}
	);
	
	$(window).focus(function() {
		console.debug("clearing timer");
		window.clearTimeout(lastTimer);
	});
	$('#dismiss').on('click', closeWindow);
}

chrome.runtime.sendMessage({type: enums.messageType.GET_CIPHERTEXT}, setupPopup);
function setupPopup(infoForPopup) {
	try {
		console.group("Received from event script"); console.log(infoForPopup); console.groupEnd("Received from event script");

		stateVars.mode = infoForPopup.mode;
		stateVars.sendResponse = infoForPopup.sendResponse;
		stateVars.tabId = infoForPopup.tabId;
		stateVars.node = infoForPopup.node;
	
		keyring = new Keyring();
		keyring.loadData(infoForPopup.keyringData);
		cipher = new Cipher(keyring, infoForPopup.ownerName);
		stateVars.plaintext = cipher.decrypt(infoForPopup.ciphertext);

		if (infoForPopup.ciphertext) {
			try {
				var encryptedKeys = JSON.parse(infoForPopup.ciphertext).encryptedKeys;
				stateVars.recipients = Object.keys(encryptedKeys);
			} catch (e) {

			}
		}

		var showBody = function() {
			$('.panel').hide();
			$('.panel').removeClass('hidden');
			$('.panel').fadeIn();
		};

		switch(stateVars.mode) {
			case "show":
				$('#heading').text('decryption');
				$('#show').html("<p>" + stateVars.plaintext.replace(/\n/g, "<br>") + "</p>").show();
				$('#show').removeClass("hidden");
				showBody();
				break;
			case "edit":
				$('#heading').text('edit decrypted text');
				$('#edit').removeClass("hidden");
				$('#edit').append("<textarea id='text-input' placeholder='Message' class='form-control' rows='4'>"+"</textarea>");
				TEXTAREA = $(TEXTAREA.selector); //refresh jQuery snapshot (since we dynamically added something) 
	
				//make the addon component popout like its supposed to
				$('.input-group-addon').css("background-color", "222222");
	
	
				//escape key
				TEXTAREA.on("keydown", function(e) {if (e.keyCode == 27) closeWindow(); });
				SEARCH_FIELD.on("keydown", function(e) {if (e.keyCode == 27) closeWindow();});
	
				//ctrl-enter
				TEXTAREA.on("keypress", function(e) {if (e.charCode == 10 && e.ctrlKey === true && e.shiftKey === false && e.altKey === false) closeWindow(); });
	
				autocompleteOptions = {
					source: keyring.getNames(),
					minLength: 0,
					autoFocus: true,
				};
				SEARCH_FIELD.autocomplete(autocompleteOptions);

				SEARCH_FIELD.val(stateVars.recipients !== undefined ? stateVars.recipients[0] : "");

				//we can't give focus to hidden elements, so unhide them now
				showBody();

				//hack to move caret to end (http://stackoverflow.com/questions/13425363/jquery-set-textarea-cursor-to-end-of-text)
				TEXTAREA.focus().val(stateVars.plaintext);

				if (SEARCH_FIELD.val() === "") {
					SEARCH_FIELD.focus();
				}

				break;
			default:
				alert("developer mistake...invalid mode specified");
		}
	}
	catch (e) {
		console.groupEnd();
		console.error(e.stack);
		alert(e.stack);
	}
}

chrome.windows.getCurrent(function(w) {
	stateVars.window = w.id;
});	

function closeWindow() {

	if (stateVars.mode == "edit") {
		var recipients = SEARCH_FIELD.val() === "" ? [] : [SEARCH_FIELD.val()];
		var infoForPage = {
			type: "return ciphertext",
			nodeId: stateVars.node.id,
			ciphertext: cipher.encrypt(TEXTAREA.val(), recipients)
		};

		chrome.tabs.sendMessage(stateVars.tabId, infoForPage);
	}

	chrome.windows.remove(stateVars.window);
}
