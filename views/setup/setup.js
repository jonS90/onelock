// every "next" button will store stuff to this
fieldValues = {
  publicKey: -1,
  privateKey: -1,
  signedName: -1,
};

/**
 * Save values to storage. This is called by the last "Next" button the user clicks.
 */
storeFieldValues = function() {
	chrome.storage.local.set({
		ownerName: fieldValues.signedName,
	});
	var contact = {
		signedName: fieldValues.signedName, 
		privateKey: fieldValues.privateKey,
		publicKey: fieldValues.publicKey,
	};
	chrome.runtime.sendMessage({
		type: enums.messageType.ADD_CONTACT,
		contact: contact,
		overwrite: true
	});
};



$(function() {
	NAVIGATION = $('#navigation');
	BACK_BTN = $('#backward');
	FORWARD_BTN = $('#forward');
	PROMPT = $('#methodPrompt');
	IMPORTKEY_DIV = $('#importKey');
	GENERATEKEY_DIV = $('#generateKeyPage');
	GENERATE_BTN = $('#generateBtn');
	IMPORT_BTN = $('#importBtn');
	GENERATE_NEXT_BTN = $('#generate-next');
	IMPORT_NEXT_BTN = $('#import-next');
	NAME_NEXT_BTN = $('#name-next');
	NAME_DIV = $('#name-prompt');
	DONE_DIV = $('#all-done');


	DURATION = 600;

	var pageHistory = [];
	var pageFuture = [];
	var pageCurrent = PROMPT;

	function fromTo(from, to, callback) {
		NAVIGATION.fadeIn(1000);
		pageFuture = [];
		pageHistory.push(pageCurrent);
		pageCurrent = to;
		to.slideDown(DURATION);
		from.hide(DURATION);
		updateEnabledButtons();
		if (callback)
			callback();
	}
	function goBack() {
		pageCurrent.slideUp(DURATION);
		pageFuture.push(pageCurrent);
		pageCurrent = pageHistory.pop();
		pageCurrent.show(DURATION);
		updateEnabledButtons();
	}
	function goForward() {
		pageCurrent.hide(DURATION);
		pageHistory.push(pageCurrent);
		pageCurrent = pageFuture.pop();
		pageCurrent.slideDown(DURATION);
		updateEnabledButtons();
	}
	function updateEnabledButtons() {
		if (pageHistory.length !== 0)
			BACK_BTN.removeClass("disabled");
		else
			BACK_BTN.addClass("disabled");

		if (pageFuture.length !== 0)
			FORWARD_BTN.removeClass("disabled");
		else
			FORWARD_BTN.addClass("disabled");
	}

	IMPORTKEY_DIV.hide();
	GENERATEKEY_DIV.hide();
	NAVIGATION.hide();
	NAME_DIV.hide();
	DONE_DIV.hide();
	BACK_BTN.addClass("disabled");
	FORWARD_BTN.addClass("disabled");

	IMPORT_BTN.on('click', function() {
		window.location.hash = "#importing_keys";
		fromTo(PROMPT, IMPORTKEY_DIV);
	});
	GENERATE_BTN.on('click', function() {
		window.location.hash = "#generating_keys";
		fromTo(PROMPT, GENERATEKEY_DIV, generateKey);
	});
	GENERATE_NEXT_BTN.on('click', function() {
		window.location.hash = "#name";
		fromTo(GENERATEKEY_DIV, NAME_DIV);
	});
	NAME_NEXT_BTN.on('click', function() {
		window.location.hash="#done";
		fromTo(NAME_DIV, DONE_DIV);
	});
	IMPORT_NEXT_BTN.on('click', function() {
		window.location.hash="#name";
		fromTo(IMPORTKEY_DIV, NAME_DIV);
	});
	BACK_BTN.on('click', goBack);
	FORWARD_BTN.on('click', goForward);
});