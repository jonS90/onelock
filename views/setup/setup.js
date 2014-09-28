$(function() {
	NAVIGATION = $('#navigation');
	BACK_BTN = $('#backward');
	FORWARD_BTN = $('#forward');
	PROMPT = $('#methodPrompt');
	IMPORTKEY_DIV = $('#importKey');
	GENERATEKEY_DIV = $('#generateKeyPage');
	GENERATE_BTN = $('#generateBtn');
	IMPORT_BTN = $('#importBtn');

	DURATION = 600;

	var pageHistory = [];
	var pageFuture = [];
	var pageCurrent = PROMPT;

	function fromTo(from, to, callback) {
		NAVIGATION.fadeIn(1000);
		BACK_BTN.removeClass("disabled");
		FORWARD_BTN.addClass("disabled");
		pageFuture = [];
		pageHistory.push(pageCurrent);
		pageCurrent = to;
		to.slideDown(DURATION);
		from.hide(DURATION);
		if (callback)
			callback();
	}
	function goBack() {
		pageCurrent.slideUp(DURATION);
		pageFuture.push(pageCurrent);
		pageCurrent = pageHistory.pop();
		pageCurrent.show(DURATION);
		BACK_BTN.addClass("disabled");
		FORWARD_BTN.removeClass("disabled");
	}
	function goForward() {
		pageCurrent.hide(DURATION);
		pageHistory.push(pageCurrent);
		pageCurrent = pageFuture.pop();
		pageCurrent.slideDown(DURATION);
		BACK_BTN.removeClass("disabled");
		FORWARD_BTN.removeClass("disabled");
	}

	IMPORTKEY_DIV.hide();
	GENERATEKEY_DIV.hide();
	NAVIGATION.hide();
	BACK_BTN.addClass("disabled");
	FORWARD_BTN.addClass("disabled");

	IMPORT_BTN.on('click', function() {
		window.location.hash = "#importing_keys"
		fromTo(PROMPT, IMPORTKEY_DIV);
	});
	GENERATE_BTN.on('click', function() {
		window.location.hash = "#generating_keys"
		fromTo(PROMPT, GENERATEKEY_DIV, generateKey);
	})
	BACK_BTN.on('click', goBack);
	FORWARD_BTN.on('click', goForward);


})