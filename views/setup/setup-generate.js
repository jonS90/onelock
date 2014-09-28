
function generateKey() {
  /* DUPLICATE CODE */
  var SHOW_KEYS_BTN = $('#show-keys-btn');
  var SHOW_KEYS_DIV = $('#showKeys');
  var GEN_STATUS = $('#genstatus');
  var SHOW_PRIV = $('#show-priv');
  var SHOW_PUB = $('#show-pub');
  var AFTER_GEN = $('.done-generating');
  /* END DUPLICATE CODE */
  Cipher.generateKey(function(privKey, pubKey) {
    SHOW_PUB.text(pubKey);
    SHOW_PRIV.text(privKey);
    AFTER_GEN.fadeIn();
    GEN_STATUS.removeClass("text-info");
    GEN_STATUS.addClass("text-success");
    GEN_STATUS.text("We made you a new key!");

  })
}

$(function() {
  /* DUPLICATE CODE */
  SHOW_KEYS_BTN = $('#show-keys-btn');
  var SHOW_KEYS_DIV = $('#showKeys');
  var GEN_STATUS = $('#genstatus');
  var SHOW_PRIV = $('#show-priv');
  var SHOW_PUB = $('#show-pub');
  var AFTER_GEN = $('.done-generating');
  /* END DUPLICATE CODE */

  AFTER_GEN.hide();
  SHOW_KEYS_DIV.hide();

  console.log("WORK!!!")
  console.log(SHOW_KEYS_BTN)
  console.log(SHOW_KEYS_BTN.html());
  SHOW_KEYS_BTN.on('click', function() {
    console.log("hi")
    SHOW_KEYS_DIV.slideToggle();
  })
})
