$(function() {
  NAME = $('#name');
  CLEAR = $('#clear');
  SETUP_BTN = $('#setup-btn');
  SETUP_DIV = $('#setup-div');

  CLEAR.on('click', function() {
    if (confirm("Clear storage...do you REALLY want to do that?")) {
      console.error("CLEARING");
      chrome.storage.local.set({keyringData: null, ownerName: null});
    }
  });
  SETUP_BTN.on('click', function() {
      var createProperties = {url: chrome.extension.getURL('views/setup/setup.html')};
      chrome.tabs.create(createProperties);
  });

  chrome.storage.local.get("ownerName", afterStorageFetch);
  function afterStorageFetch(items) {
    if (items.ownerName) {
      NAME.text(items.ownerName);
      SETUP_DIV.addClass('hidden');
    } else {
      NAME.text("--wait...I don't know your name. Go do the setup first!!!");
      SETUP_DIV.removeClass('hidden');
    }
  }
});