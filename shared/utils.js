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

/**
 * Creates a sharable string to send to friends
 * @param  {KeyEntry} keyEntry  [description]
 * @return {String}             A sharable string others can use to import contact info
 * @throws {Error}    If privateKey is not present in keyEntry
 */
utils.exportKey = function(keyEntry) {
}

/**
 * Extracts contact info from a string
 * @param  {String} str   A string exported from another user
 * @return {KeyEntry}     Valid contact info you can add to keyring
 */
utils.importKey = function(str) {

}