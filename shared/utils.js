utils = {}

/**
 * Returns true if argument looks like a valid private key, otherwise false. 
 * @param  string str
 * @returns {boolean} Whether or not it looks valid. 
 */
utils.validatePublicKey = function(str) {
  begStr = "-----BEGIN PUBLIC KEY-----";
  endStr = "-----END PUBLIC KEY-----";

  if (str.indexOf(begStr) == 0 &&
    str.indexOf(endStr) == (str.length-endStr.length))
    return true
  else 
    return false;
}
