/*
 * PGP surfer
 * (content script)
 * This runs on every single page the user visits. Per Chrome's 
 * platform, it has access to the DOM of the page it's running on, but 
 * it does not have access to any of the page's javascript. 
 * (Conversely, the page's javascript does not have access to any of 
 * THIS javascript). 
 */

// don't do anything unless we see the flag: <body data-pgp="1">
if ($('body').data("pgp")) {

  console.log("security features enabled");

  chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
      switch(message.type) {
        case "return ciphertext": 
          $("#" + message.nodeId).val(message.ciphertext);
          nodeModifiers.clickNodeToEditValue($("#" + message.nodeId));
          break;
        case "log":
          console.log(message);
          break;
        default:
          alert("Content script doesn't know what to do with this message");
          console.log(message);
      }
    })


  
  $(document).ready(function() {

    var classOfReadableItems = $('body').data("readable-class");
    var classOfEditableItems = $('body').data("editable-class");



    //decrypt the encrypted
    var encFunc = nodeModifiers.clickNodeToDecryptText //decryptTextInPlace //
    observer.observeChanges("encrypted", encFunc, nodeModifiers.isNodeMarked);
    $('.encrypted').each(function() {
      encFunc($(this));
    })

    //encrypt the decrypted
    observer.observeChanges("decrypted", nodeModifiers.clickNodeToEditValue, nodeModifiers.isNodeMarked);
    $('.decrypted').each(function() {
      nodeModifiers.clickNodeToEditValue($(this));
    })
  });




// vvvvvvvvvvvvvvvv DEPRECATED vvvvvvvvvvvvvvvvvv
  // Listen for "encryption request messages"
  //https://developer.chrome.com/extensions/content_scripts
  var port = chrome.runtime.connect();
  window.addEventListener("message", function(event) {
    console.log(event)
    // We only accept messages from ourselves
    if (event.source != window) {
      console.log("wrong window")
      return;
    }

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
      console.log("Content script received: " + event.data.text);
      encryptElements();
      // port.postMessage(event.data.text);
    }
  }, false);

} else {
  console.log("no security features");
} 
  //highlightComponents = function() {
  //  //$(".encrypted").fadeOut().css("color","blue").fadeIn();
  //  $('.encrypted, .decrypted').fadeOut().queue(function(){
  //    // $(this).css("color", "blue"); 
  //    // $(this).css("font-style", "italic");
  //    //  ^ when jQuery changes css, it does so in the html, and it is thrown 
  //    //  out whenever meteor re-renders the html. I might consider adding a 
  //    //  custom class, prepending it to the body?
  //    $(this).fadeIn();
  //    $(this).dequeue();
  //  });
  //}
  function generateID() {
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }); //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
  }
// ^^^^^^^^^^^^^^^^ DEPRECATED ^^^^^^^^^^^^^^^^^^
