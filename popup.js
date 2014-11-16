var currentUrl; //set via asyncQueryCurrentUrl()
var enabledUrls; //set via asyncFetchEnabledUrls()

function asyncQueryCurrentUrl(callback) {
	chrome.tabs.query( {'active': true, 'lastFocusedWindow': true}, function(tab) {
		currentUrl = tab[0].url;
		if (callback)
			callback();
	});
}
function asyncFetchEnabledUrls(callback) {
	chrome.storage.local.get(["enabledUrls"], function(storage) {
		enabledUrls = storage.enabledUrls;
		if (callback) 
			callback();
	});
}
function prepareDocument(callback) {
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
			method = el.attr('id').slice(2);
			chrome.storage.local.set({"displayMethod":method});
		} else if (group == "edit") {
			method = el.attr('id').slice(2);
			chrome.storage.local.set({"editMethod":method});
		} 
	});

	KEYRING_COPY.on('click', function() {
		chrome.runtime.sendMessage({type: enums.messageType.GET_PUBLICKEY}, afterResponse);
		function afterResponse(publicKey) {
			copyToClipboard(publicKey);
			window.close();
		}
	});
	KEYRING_ADD.on('click', function() {
		//open view as popup
		var w = 405;
		var h = 320; //655
		var left = Math.round((window.screen.width - w) / 2);
		var top = Math.round((window.screen.height - h) / 2);
		var windowUrl = chrome.extension.getURL('views/add_contact/add_contact.html');
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
	});
	USEWITH_FACEBOOK.on('click', function() {
		ischecked = $(this).is(':checked');
		chrome.storage.local.set({"facebook": ischecked}, function() {
			console.log("facebook: " + ischecked);
		});
	});

	chrome.storage.local.get(["displayMethod", "editMethod", "facebook"], function(settings) {
		display = settings.displayMethod;
		edit = settings.editMethod;
		$("#d_" + display).parent().addClass("active");
		$("#e_" + edit).parent().addClass("active");
		$("#facebook").prop('checked', settings.facebook);
	});
	if (callback)
		callback();
}

var incompleteAsyncCalls = 3; 
{
	asyncQueryCurrentUrl(finishedAsync);
	asyncFetchEnabledUrls(finishedAsync);
	$(prepareDocument(finishedAsync));
}

function finishedAsync() {
	// error check
	if (incompleteAsyncCalls < 0) { alert("I did some BAAAAD code");}

	incompleteAsyncCalls--;
	if (incompleteAsyncCalls == 0) {
		// at this point, currentUrl and enabledUrls have been set

		for (var i = 0; i < enabledUrls.length; i++) {
			if (enabledUrls[i].indexOf(currentUrl) != -1) {
				alert("THIS IS ENABLED");
				return;
				// will finish this later
			}
		}
		alert("THIS IS NOT ENABLED");
	}
}

//////////////////////
// helper functions //
//////////////////////
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