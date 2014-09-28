$(window).on("navigate", function (event, data) {
    var direction = data.state.direction;
    if ( !! direction) {
        alert(direction);
    }
});

$(function() {
	PROMPT = $('#methodPrompt');
	IMPORTKEY_DIV = $('#importKey');
	GENERATE_BTN = $('#generateBtn');
	IMPORT_BTN = $('#importBtn');
	IMPORTKEY_DIV.hide();

	IMPORT_BTN.on('click', function() {
		window.location.hash = "#importing_keys"
		IMPORTKEY_DIV.show(); //need back button support
		PROMPT.hide();
	});

})