
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

  
  decryptText = function(ciphertext) {
    var password = "sdflkjweljsflkjsdflkjsdflkjsdfkljsdflkjsdflkj";
    // console.log("decrypting >" + ciphertext + "<")    
    var plaintext  = CryptoJS.AES.decrypt(ciphertext, password).toString(CryptoJS.enc.Utf8);
    if (plaintext == "") plaintext = "decryption failed"
    plaintext += " `";  //leave a recognizable mark
    return plaintext
  }

  textIsDecrypted = function(text) {
    return (text.slice(-2) == " `")
  }
  
  

  encryptText = function(plaintext) {
    var password = "sdflkjweljsflkjsdflkjsdflkjsdfkljsdflkjsdflkj";
    var ciphertext  = CryptoJS.AES.encrypt(plaintext, password).toString();
    // ciphertext += " ~";  //leave a recognizable mark
    // console.log("encrypted >" + plaintext + "< to " + ciphertext)
    return ciphertext
  }

  $(document).ready(function() {
    $encrypted = $('.encrypted');


    observer.observeChanges("encrypted", decryptText, textIsDecrypted);
    $encrypted.fadeOut().queue(function() {
      $(this).text(decryptText($(this).text()));
      $(this).dequeue();
    }).fadeIn(1000);

  });


  encryptElements = function() {
    $(".decryptedval").each(function() {
      $(this).val(encryptText( $(this).val() ));
    })
  }

  // Listen for "encryption request messages"
  //https://developer.chrome.com/extensions/content_scripts
  var port = chrome.runtime.connect();

  window.addEventListener("message", function(event) {
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
  //console.log("no security features");
} 
