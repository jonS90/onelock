// alert('hi')
// alert($('#popup').selected())
// $('.btn').on('click', function({this.addClass('active')}));
$(function() {
	$("body").on("click", ".btn", function() { //https://github.com/twbs/bootstrap/issues/2380
		el = $(this).children();
		group = el.attr('name');
		if (group == "display") {
			console.log('display')
			method = el.attr('id').slice(2)
			chrome.storage.local.set({"displayMethod":method})
		} else if (group == "edit") {
			console.log('edit')
			method = el.attr('id').slice(2)
			chrome.storage.local.set({"editMethod":method})
		} 
	})

	$('#facebook').on('click', function() {
		ischecked = $(this).is(':checked')
		chrome.storage.local.set({"facebook": ischecked})
	})

	console.log("here")
	chrome.storage.local.get(["displayMethod", "editMethod", "facebook"], function(settings) {
		display = settings.displayMethod
		edit = settings.editMethod
		$("#d_" + display).parent().addClass("active");
		$("#e_" + edit).parent().addClass("active");
		$("#facebook").prop('checked', settings.facebook)
	})
});