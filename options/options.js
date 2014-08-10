// Saves options to chrome.storage
function save_options() {
  // todo implement save_options
  var color = document.getElementById('color').value;
  var likesColor = document.getElementById('like').checked;
  chrome.storage.sync.set({
    favoriteColor: color,
    likesColor: likesColor
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // todo implement restore_options
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    favoriteColor: 'red',
    likesColor: true
  }, function(items) {
    document.getElementById('color').value = items.favoriteColor;
    document.getElementById('like').checked = items.likesColor;
  });
}
// document.addEventListener('DOMContentLoaded', restore_options);
// document.getElementById('save').addEventListener('click',
//     save_options);

validate_private_key = function(str) {
  begStr = "-----BEGIN RSA PRIVATE KEY-----";
  endStr = "-----END RSA PRIVATE KEY-----";

  if (str.indexOf(begStr) == 0 &&
    str.indexOf(endStr) == (str.length-endStr.length))
    return true
  else 
    return false;
}

validate_public_key = function(str) {
  begStr = "-----BEGIN PUBLIC KEY-----";
  endStr = "-----END PUBLIC KEY-----";

  if (str.indexOf(begStr) == 0 &&
    str.indexOf(endStr) == (str.length-endStr.length))
    return true
  else 
    return false;
}


PRIVATE_KEY = $('#private-key');
PUBLIC_KEY = $('#public-key');

validateKeyFields = function(option) {
  console.log("IN FUNCTION" )
  switch (option) {
    case ("private"):
      object = PRIVATE_KEY
      console.log("a")
      check = validate_private_key
      console.log("a")
      break;
    case ("public"):
      object = PUBLIC_KEY
      console.log("a")
      check = validate_public_key
      console.log("a")
      break;
    default: throw "neither public nor private"
  }
  console.log(object)
  console.log("val: " + $(object).val() + object.attr('value'  ))
  console.log($(object))
  if (check(object.val())) 
    object.css('background-color', 'green');
  else
    object.css('background-color', 'red');

  if (validate_private_key(PRIVATE_KEY.val()) &&
    validate_public_key(PUBLIC_KEY.val()))
    alert("they will get updated here");
  

  if (!validate_private_key(PRIVATE_KEY.val())) {
    $(this).css('background-color', 'red');
  } else {
    $(this).css('background-color', 'green');
  }


}

$(function() {
  console.log("LOADED")
  // events for private key textarea
  PRIVATE_KEY.on('focus', function() {
    PRIVATE_KEY.css('background-color', 'white');
  })
  PRIVATE_KEY.on('blur', validateKeyFields("private"));

  //events for public key textarea
  PUBLIC_KEY.on('focus', function() {
    PUBLIC_KEY.css('background-color', 'white');
  })
  PUBLIC_KEY.on('blur', validateKeyFields("public"));
});