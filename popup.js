$(function() {
	// VARIABLES
	KEYRING_ADD = $("#keys_add");
	KEYRING_MANAGE = $("#keys_manage");
	USEWITH_FACEBOOK = $("#facebook");

	// GROUPED-BUTTON CLICKS
	// Here's why I detect clicks on the body: https://github.com/twbs/bootstrap/issues/2380
	$("body").on("click", ".btn", function() { 
		el = $(this).children();
		group = el.attr('name');
		if (group == "display") {
			method = el.attr('id').slice(2)
			chrome.storage.local.set({"displayMethod":method})
		} else if (group == "edit") {
			method = el.attr('id').slice(2)
			chrome.storage.local.set({"editMethod":method})
		} 
	})

	KEYRING_ADD.on('click', function() {
		//open view as popup
		var w = 405
		var h = 555 //655
		var left = Math.round((window.screen.width - w) / 2);
		var top = Math.round((window.screen.height - h) / 2);
		var windowUrl = chrome.extension.getURL('views/add_contact/add_contact.html')
		var windowOptions = {
			url: windowUrl, 
			width: w, 
			height: h, 
			left: left, 
			top: top, 
			focused:true, 
			type:"popup"
		};
		chrome.windows.create(windowOptions);
	})
	USEWITH_FACEBOOK.on('click', function() {
		ischecked = $(this).is(':checked')
		chrome.storage.local.set({"facebook": ischecked})
	})

	chrome.storage.local.get(["displayMethod", "editMethod", "facebook"], function(settings) {
		display = settings.displayMethod
		edit = settings.editMethod
		$("#d_" + display).parent().addClass("active");
		$("#e_" + edit).parent().addClass("active");
		$("#facebook").prop('checked', settings.facebook)
	})
});