
console.log("hello");

$('input').on("click", function(event) { 
  $('#out').html("yay");  
});


$('#newtab').on("click", function(event) {
  chrome.tabs.create({"url":"popup.html"});
});
