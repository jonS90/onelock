/*
 * PGP surfer
 * (content script)
 * This runs on every single page the user visits. Per Chrome's 
 * platform, it has access to the DOM of the page it's running on, but 
 * it does not have access to any of the page's javascript. 
 * (Conversely, the page's javascript does not have access to any of 
 * THIS javascript). 
 */



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
      observer.observeChanges(displayClass, displayMethod, nodeModifiers.isNodeMarked);
      $('.'+displayClass).each(function() {
        displayMethod($(this));
      });

      //encrypted input elements
      observer.observeChanges(editClass, editMethod, nodeModifiers.isNodeMarked);
      $('.'+editClass).each(function() {
        nodeModifiers.clickNodeToEditValue($(this));
      });
    });
  });

  chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
      switch(message.type) {
        case "return ciphertext": 
          $("#" + message.nodeId).val(message.ciphertext);
          nodeModifiers.clickNodeToEditValue($("#" + message.nodeId)); //TODO don't make this assumption!!!
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