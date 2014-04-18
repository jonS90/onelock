
console.log("hello");

$('input').on("click", function(event) { 
  $('#out').html("yay");  
});


$('#newtab').on("click", function(event) {
  chrome.tabs.create({"url":"popup.html"});
});

console.log("hello");

$('input').on("click", function(event) { 
  $('#out').html("yay");  
});


$('#newtab').on("click", function(event) {
  chrome.tabs.create({"url":"popup.html"});
});
$('#popup').on("click", function(event) {
	var url = chrome.extension.getURL('safe_view/demo.html')
	chrome.windows.create({url: url, width: 291, height: 180, focused:true,type:"popup"});
	// chrome.windows.create()
})