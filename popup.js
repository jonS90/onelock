$(function() {
	// VARIABLES
	KEYRING_ADD = $("#keys_add");
	KEYRING_MANAGE = $("#keys_manage");
	KEYRING_COPY = $("#keys_copy");
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

	KEYRING_COPY.on('click', function() {
		copyToClipboard("WASSUP") //TODO insert actual key here
		window.close()
	})
	KEYRING_ADD.on('click', function() {
		//open view as popup
		var w = 405
		var h = 320 //655
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
		chrome.storage.local.set({"facebook": ischecked}, function() {
			console.log("facebook: " + ischecked)
		})
	})

	chrome.storage.local.get(["displayMethod", "editMethod", "facebook"], function(settings) {
		display = settings.displayMethod
		edit = settings.editMethod
		$("#d_" + display).parent().addClass("active");
		$("#e_" + edit).parent().addClass("active");
		$("#facebook").prop('checked', settings.facebook)
	})
});


function copyToClipboard(text){
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerHTML = text;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.body.removeChild(copyDiv);
} //https://coderwall.com/p/5rv4kq