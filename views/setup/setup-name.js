$(function() {
	var NEXT_BTN = $('#name-next');
	var INPUT = $('#name-input');

	var re = /\w\w+\s+\w\w+/;
	var validateAndEnable = function() {
		if (re.test(INPUT.val()))
			NEXT_BTN.removeClass("disabled");
		else 
			NEXT_BTN.addClass("disabled");
	};
	INPUT.on('keypress', validateAndEnable);
	INPUT.on('change', validateAndEnable);


	NEXT_BTN.addClass("disabled");

	NEXT_BTN.on('click', function() {
		fieldValues.signedName = INPUT.val();
		storeFieldValues();
	});
});