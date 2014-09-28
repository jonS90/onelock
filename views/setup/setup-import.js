/**
 * Saves fields to chrome.storage.
 */
function save_fields() {
  //todo the private key, at least, should be encrypted
  PUBLIC_KEY.val();
  chrome.storage.sync.set({
    privateKey: PRIVATE_KEY.val(),
    publicKey: PUBLIC_KEY.val()
  }, function() {
    STATUS.text("Fields saved");
    setTimeout(function() {
      STATUS.text("");
    }, 750)
  })
  return
}

/**
 * Fill form with valid values. For testing purposes!
 */
function auto_fill() {
  PRIVATE_KEY.val("-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAzoWIXqCGKrIeFTHH2p5kzK6x3eOgFcaQLu7BVmwugZbvTseQ\noTrQx/wOXLh0G3fGb+jQTIcsCl57mxh2lHNXfkCJK5u4G+0WkwTS1AcdmqvQuhyy\nPg0+HbZahk4HwbbXFZWdHVHvelKcR1Zn3mKZZmDWSLqHHbQpN1tu/u2IcbmG6uMP\noK8aiVF2L0SHVtw/QRnXP5PKDz7pqmc1KieTC0MRRKV4nJ4L04rQind5UiiQFpF/\nLOBYNUFs3df9Pr2Yf9Xz3sdY87hP9h/HDvxUv9s8sFirV1npomHGCIG+MZVBU1eh\nzPbELpyo3i13oEi2SrVduLw1lJkO4NjwO4c1oQIDAQABAoIBAGX3nFtMWrId+6hv\nScPxTMeawYtS5imaPnpNu/vVsiidw05cTlas2YTEOLsi/4DIZJvAkYgXfXEpMVJk\ng7fMMzjM2G1Fl2OCbhDs4sN5N+60QnyByqfElhTJgmypfj7w7cVkd4yQdfMpcqvu\nR56PhDn+Og7yud+6olcIuAb6dNHg62Pm/KmchcvevwReDJnUtchRaowNAz4r0Zt3\nBAYtjWCJXvfN3TwHulEIWwNvGzWRBXmVMAOQxsZmIvGj4RMMuUit6DJ0nc/ufOGR\nLFfZzXWxCEXog761OobPlWr8qttkKRhLUtTmSTalaExr8SS0NeF0kiBwhPrdqx9i\ndS5tJRkCgYEA5g0VmY7oxvP5FOfHIcLPCn4uYaV1b08m4r6hQjhD99mB5LujemLF\nYcqirU3aKRlKAnirhf7dXl4M6aPyHPnHBdaj4CZf8FSf28/WVchrv6rWTP/YOZGt\nmNsaKalJSjG8nKZ0UTQjsack/M1H2pSyUzdy9GuX4b/2KokppUSU9p8CgYEA5dED\nvtGaaBY8JRBiwlFY7A//9Yj4TknPBYS2lsQ+PmhendWRkAUNowTqAR/ErQTDL+Bt\nwOhB9ut/sVoXWU7OgafrnEEDW5xS+fraNSfyNzFKgp09Kvhw/ESAfh0orcjSW5HP\nv6wqy0lnos+X9SyVXqW+uFA02eteaQKHXfH5q78CgYAauh5uTrogkyu3EA6Ej5t6\nPpqo4Y45NlrwMPGPPfY3j1+V8W7Wwy7nY6FuvQLBj5yXmOlkke2qDwc1BcUVNLe4\np+02F39B7rL72LOwF67c/74SCA9Y8OHYRmxNtss7AXhGQth0rrgO5bpYXIkijfAB\n1wlV+EIXCjRRUMoz1znvRQKBgQCfWn4xW1+omvpbbPA983AoR7PhCne6uV0uY2bE\nRhEu7unkoYlMhuR8zFSCMQgMPMgnM4SHBcVvtL4XOPQFvipdJxWthDsS0+OJaNLT\nlv5SHQCgbu1SFXEqy0kZqZhiYGTUj9ew/W2zBhQxhabFn4N3XJBRd3QeQyF0yQca\nMkZAOwKBgHFq/BkXzfXA/153QwVB0QB+Ro78LKzm9XCXoHa4Llim2PZuNxGnH2qJ\nVD9wH8kPJUwpBa00ERl3G/lNVXIzE8m/8wypUIoaZ1t9Y1oq3JvJRkseUbR7JycO\n+VHuW+vXYdwcfqWB5JOqEUEH6B9V9I+40PzawZ/3pSZ4ZZ0G6qU3\n-----END RSA PRIVATE KEY-----");
  PUBLIC_KEY.val("-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzoWIXqCGKrIeFTHH2p5k\nzK6x3eOgFcaQLu7BVmwugZbvTseQoTrQx/wOXLh0G3fGb+jQTIcsCl57mxh2lHNX\nfkCJK5u4G+0WkwTS1AcdmqvQuhyyPg0+HbZahk4HwbbXFZWdHVHvelKcR1Zn3mKZ\nZmDWSLqHHbQpN1tu/u2IcbmG6uMPoK8aiVF2L0SHVtw/QRnXP5PKDz7pqmc1KieT\nC0MRRKV4nJ4L04rQind5UiiQFpF/LOBYNUFs3df9Pr2Yf9Xz3sdY87hP9h/HDvxU\nv9s8sFirV1npomHGCIG+MZVBU1ehzPbELpyo3i13oEi2SrVduLw1lJkO4NjwO4c1\noQIDAQAB\n-----END PUBLIC KEY-----");
  SUBMIT.prop("disabled", !validateForm()); 
}

/**
 * Restores fields from chrome.storage
 */
function restore_fields() {
  chrome.storage.sync.get({
    privateKey: '',
    publicKey: ''
  }, function(items) {
    PRIVATE_KEY.val(items.privateKey);
    PUBLIC_KEY.val(items.publicKey);
  });
}

/**
 * Returns true if argument looks like a valid private key, otherwise false. 
 * @param  string str
 * @returns {boolean} Whether or not it looks valid. 
 */
validate_private_key = function(str) {
  begStr = "-----BEGIN RSA PRIVATE KEY-----";
  endStr = "-----END RSA PRIVATE KEY-----";

  if (str.indexOf(begStr) == 0 &&
    str.indexOf(endStr) == (str.length-endStr.length))
    return true
  else 
    return false;
}

/**
 * Returns true if argument looks like a valid private key, otherwise false. 
 * @param  string str
 * @returns {boolean} Whether or not it looks valid. 
 */
validate_public_key = function(str) {
  begStr = "-----BEGIN PUBLIC KEY-----";
  endStr = "-----END PUBLIC KEY-----";

  if (str.indexOf(begStr) == 0 &&
    str.indexOf(endStr) == (str.length-endStr.length))
    return true
  else 
    return false;
}



validateForm = function() {
  if (validate_private_key(PRIVATE_KEY.val()) && validate_public_key(PUBLIC_KEY.val())) {
    return true;
  }
}
validateKeyFields = function(option) {
  switch (option) {
    case ("private"):
      object = PRIVATE_KEY
      check = validate_private_key
      break;
    case ("public"):
      object = PUBLIC_KEY
      check = validate_public_key
      break;
    default: throw "neither public nor private"
  }
  if (check(object.val())) 
    object.css('background-color', 'green');
  else
    object.css('background-color', 'red');
}

/****************************************************
* Main
****************************************************/
$(function() {
  // VARIABLES
  SHOWHOWTO_LNK = $('#showHowTo');
  HOWTO = $('#terminalHowTo');
  PRIVATE_KEY = $('#private-key');
  PUBLIC_KEY = $('#public-key');
  STATUS = $('.status');
  SUBMIT = $('input.btn-success');

  // pretty print the code block shown for user-instruction
  prettyPrint();

  SUBMIT.prop( "disabled", true );
  HOWTO.hide();

  restore_fields();

  // EVENTS
  SHOWHOWTO_LNK.on('click', function() {HOWTO.toggle()})
  PRIVATE_KEY.on('focus', function() {PRIVATE_KEY.css('background-color', 'white') })
  PRIVATE_KEY.on('blur', function()  {validateKeyFields("private")});
  PUBLIC_KEY.on('focus', function()  {PUBLIC_KEY.css('background-color', 'white') })
  PUBLIC_KEY.on('blur', function()   {validateKeyFields("public")});

  $('textarea').on('change', function() { 
    SUBMIT.prop("disabled", !validateForm()); 
  });

  SUBMIT.on('click', function() {
    if (validateForm()) {
      save_fields();
    }
  })

  //for testing:
  //auto_fill()
});