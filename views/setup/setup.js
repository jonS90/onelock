$(function() {
	NAVIGATION = $('#navigation');
	BACK_BTN = $('#backward');
	FORWARD_BTN = $('#forward');
	PROMPT = $('#methodPrompt');
	IMPORTKEY_DIV = $('#importKey');
	GENERATE_BTN = $('#generateBtn');
	IMPORT_BTN = $('#importBtn');

	var pageHistory = [];
	var pageFuture = [];
	var pageCurrent = PROMPT;

	function fromTo(from, to) {
		NAVIGATION.fadeIn(1000);
		BACK_BTN.removeClass("disabled");
		FORWARD_BTN.addClass("disabled");
		pageFuture = [];
		pageHistory.push(pageCurrent);
		pageCurrent = to;
		to.slideDown(1000);
		from.hide(1000);
	}
	function goBack() {
		pageCurrent.slideUp(1000);
		pageFuture.push(pageCurrent);
		pageCurrent = pageHistory.pop();
		pageCurrent.show(1000);
		BACK_BTN.addClass("disabled");
		FORWARD_BTN.removeClass("disabled");
	}
	function goForward() {
		pageCurrent.hide(1000);
		pageHistory.push(pageCurrent);
		pageCurrent = pageFuture.pop();
		pageCurrent.slideDown(1000);
		BACK_BTN.removeClass("disabled");
		FORWARD_BTN.removeClass("disabled");
	}

	IMPORTKEY_DIV.hide();
	NAVIGATION.hide();
	BACK_BTN.addClass("disabled");
	FORWARD_BTN.addClass("disabled");

	IMPORT_BTN.on('click', function() {
		window.location.hash = "#importing_keys"
		fromTo(PROMPT, IMPORTKEY_DIV);
	});
	BACK_BTN.on('click', goBack);
	FORWARD_BTN.on('click', goForward);


})