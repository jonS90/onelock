// TODO: autopopulate contact field

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
	
		switch(stateVars.mode) {
			case "show":
				$('#heading').text('decryption');
				$('#show').html("<p>" + stateVars.plaintext.replace(/\n/g, "<br>") + "</p>").show();
				$('#show').fadeIn();
				$('#show').removeClass("hidden");
				break;
			case "edit":
				$('#heading').text('edit decrypted text');
				$('#edit').fadeIn();
				$('#edit').removeClass("hidden");
				$('#edit').append("<textarea id='text-input' class='form-control' rows='4'>"+"</textarea>");
				TEXTAREA = $(TEXTAREA.selector); //refresh jQuery snapshot (since we dynamically added something) 
	
				//make the bootstrap input-group popout like its supposed to
				$('.panel-body').css("background-color", "222222");
	
				SUGGESTION_BOX = $('ul');
	
				//hack to move caret to end (http://stackoverflow.com/questions/13425363/jquery-set-textarea-cursor-to-end-of-text)
				TEXTAREA.focus().val(stateVars.plaintext);
	
				//escape key
				TEXTAREA.on("keydown", function(e) {if (e.keyCode == 27) closeWindow(); });
	
				//ctrl-enter
				TEXTAREA.on("keypress", function(e) {if (e.charCode == 10 && e.ctrlKey === true && e.shiftKey === false && e.altKey === false) closeWindow(); });
	
				SEARCH_FIELD.autocomplete({source: keyring.getNames()});

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
		var infoForPage = {
			type: "return ciphertext",
			nodeId: stateVars.node.id,
			ciphertext: cipher.encrypt(TEXTAREA.val(), [SEARCH_FIELD.val()])
		};

		chrome.tabs.sendMessage(stateVars.tabId, infoForPage);
	}

	chrome.windows.remove(stateVars.window);
}
