/*  cipher
 *	
*/
var cipher = {}

cipher.decryptText = function(ciphertext) {
    var password = "sdflkjweljsflkjsdflkjsdflkjsdfkljsdflkjsdflkj";
    var plaintext  = CryptoJS.AES.decrypt(ciphertext, password).toString(CryptoJS.enc.Utf8);
    if (plaintext == "") plaintext = "decryption failed"
    return plaintext
}

cipher.encryptText = function(plaintext) {
    var password = "sdflkjweljsflkjsdflkjsdflkjsdfkljsdflkjsdflkj";
    var ciphertext  = CryptoJS.AES.encrypt(plaintext, password).toString();
    return ciphertext
}