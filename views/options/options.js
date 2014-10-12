$(function() {
  NAME = $('#name');
  CLEAR = $('#clear');

  CLEAR.on('click', function() {
    console.error("CLEARING");
    chrome.storage.local.set({keyringData: null, ownerName: null});
  });

  chrome.storage.local.get("ownerName", afterStorageFetch);
  function afterStorageFetch(items) {
    if (items.ownerName) {
      NAME.text(items.ownerName);
    } else {
      NAME.text("--wait...I don't know your name. Go do the setup first!!!");
    }
  }
});