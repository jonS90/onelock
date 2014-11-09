/*
 * PGP surfer
 * (content script)
 * This runs on every single page the user visits. Per Chrome's 
 * platform, it has access to the DOM of the page it's running on, but 
 * it does not have access to any of the page's javascript. 
 * (Conversely, the page's javascript does not have access to any of 
 * THIS javascript). 
 */

function ifEnabledDo(callback) {
  if ($('body').data('pgp')) {
    callback();
    return;
  } else {
    chrome.storage.local.get(["enabledUrls"], function(storage){
      var enabledUrls = storage.enabledUrls;
      enabledUrls = ["www.facebook.com"]; //DEBUGGING TODO
      if (enabledUrls) {
        var actualHref = $(location).attr('href');
        for (i = 0; i < enabledUrls.length; i++) {
          if (actualHref.indexOf(enabledUrls[i]) != -1) {
            callback(); 
            return;
          }
        }
        console.log("OneLock: this url is not enabled");
      }
    });
  }
}

ifEnabledDo(function() {
  console.log("OneLock is enabled!!!");
});

onFacebook = function() {return ($(location).attr('href').indexOf("://www.facebook.com") > -1);};

// don't do anything unless we see the flag: <body data-pgp="1">
if ($('body').data("pgp") || onFacebook()) {

  chrome.runtime.sendMessage({
    type: enums.messageType.SHOW_PAGEACTION, 
    href: $(location).attr('href') 
  });

  console.time("fetch pgp settings");

  chrome.storage.local.get(["displayMethod","editMethod", "facebook"], function(settings) {
    console.timeEnd("fetch pgp settings");
    displayMethod = enums.getDisplayMethod(settings.displayMethod);
    editMethod = enums.getEditMethod(settings.editMethod);
    
    displayClass = "encryptedtext";
    editClass = "encryptedinput" ;

    // FACEBOOK CONFIGURATION
    if ($(location).attr('href').indexOf("://www.facebook.com") > -1) {
      if (!settings.facebook) {
        console.log("PGP disabled on Facebook");
        console.log(settings);
        console.log(settings.facebook);
        return;
      }
      console.log("PGP active on Facebook");
      displayClass = "null";
      editClass = "uiTextareaAutogrow";
    }

    $(document).ready(function() {
      
      //encrypted display elements
      $('body').on('click', "."+displayClass, function() {
        console.log(this);
        var node = $(this);
        var text = node.text();
        console.log("contentscript: request to show text: " + text);
        chrome.runtime.sendMessage( {type: enums.messageType.DECRYPT_AND_SHOW, ciphertext: text, node: makePortable(node)} );
      });

      $('body').on('click', '.'+editClass, function() {
        var node = $(this);
        var text = node.val();
        console.log("contentscript: request to edit text" + text);
        chrome.runtime.sendMessage({
           type: enums.messageType.DECRYPT_AND_SHOW, 
           editable: true,
           ciphertext: text, 
           node: makePortable(node)
         });
      });

      //encrypted input elements
      // observer.observeChanges(editClass, editMethod, nodeModifiers.isNodeMarked);
      // $('.'+editClass).each(function() {
      //   nodeModifiers.clickNodeToEditValue($(this));
      // });
    });
  });

  chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
      switch(message.type) {
        case "return ciphertext": 
          $("#" + message.nodeId).val(message.ciphertext);
          break;
        case "log":
          console.log(message);
          break;
        default:
          alert("Content script doesn't know what to do with this message");
          console.log(message);
      }
    });
} else console.log("no security features");