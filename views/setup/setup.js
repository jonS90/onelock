$(function() {
	PROMPT = $('#methodPrompt');
	IMPORTKEY_DIV = $('#importKey');
	GENERATE_BTN = $('#generateBtn');
	IMPORT_BTN = $('#importBtn');
	IMPORTKEY_DIV.hide();

	IMPORT_BTN.on('click', function() {
		IMPORTKEY_DIV.show(); //need back button support
		PROMPT.hide();
	})





})