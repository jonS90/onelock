/*  cipher
 *	Depends on lib/jsencrypt.min.js. 
*/
var cipher = {}

cipher.doubleEncryption = true

cipher.keyring = [{
		name: "bob",
		publicKey: "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB-----END PUBLIC KEY-----"
	}]

cipher.privDecrypter = new JSEncrypt();
cipher.privDecrypter.setPrivateKey("-----BEGIN RSA PRIVATE KEY-----MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQABAoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fvxTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeHm7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAFz/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIMV7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATeaTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5AzilpsLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Ozuku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876-----END RSA PRIVATE KEY-----");

cipher.decrypt = function(str) {
	if (str == "") return ""
	try {
		if (cipher.doubleEncryption)
			str = CryptoJS.AES.decrypt(str, "FFFFFFFFFFFF").toString(CryptoJS.enc.Utf8)
		json = JSON.parse(str);
		encryptedData = json.ciphertext;
		encryptedKey = json.recipients[0].encryptedKey;

		plainKey = cipher.privDecrypter.decrypt(encryptedKey);
		plaintext = CryptoJS.AES.decrypt(encryptedData, plainKey).toString(CryptoJS.enc.Utf8);
		// if (plaintext == "") plaintext = "failed decryption"
		return plaintext;
	} catch (err) {
		throw (err)
		return err.stack
	}
}

cipher.encrypt = function(plainText, recipients) {
	plainKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	}); //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	cipherText  = CryptoJS.AES.encrypt(plainText, plainKey).toString();

	if (recipients) { alert("not implemented"); }

	pubEncrypter = new JSEncrypt();
	pubEncrypter.setPublicKey(cipher.keyring[0].publicKey);
	encryptedKeys = []
	encryptedKeys.push(pubEncrypter.encrypt(plainKey));

	json = {
		"ciphertext": cipherText,
		"recipients": [{"name":"bob", "encryptedKey":encryptedKeys[0]}]
	}

	str = JSON.stringify(json)
	if (cipher.doubleEncryption)
		str = CryptoJS.AES.encrypt(str, "FFFFFFFFFFFF").toString();
	return str;
}

cipher.decryptText = function(ciphertext) {
	alert('deprecated')
    var password = "sdflkjweljsflkjsdflkjsdflkjsdfkljsdflkjsdflkj";
    var plaintext  = CryptoJS.AES.decrypt(ciphertext, password).toString(CryptoJS.enc.Utf8);
    if (plaintext == "") plaintext = "decryption failed"
    return plaintext
}

cipher.encryptText = function(plaintext) {
	alert('deprecated')
    var password = "sdflkjweljsflkjsdflkjsdflkjsdfkljsdflkjsdflkj";
    var ciphertext  = CryptoJS.AES.encrypt(plaintext, password).toString();
    return ciphertext
}

var Cipher = Cipher || {}

/**
 * Cipher provides methods to for encryption.
 * @param {[type]} keyring [description]
 * @param {[type]} name    The owner of the keyring (you know, the one with the private key)
 * @throws {Error} If keyring not given
 */
function Cipher(keyring, name) {
	if (!keyring || !name) throw new Error("Null params!") 
	// settings
	var DOUBLE_ENCRYPTION = false;
	var DUMBY_KEY = "FFFFFFFFFFFF";

	var privateKey = keyring.get(name).privateKey;

	var privDecrypter;

	/*******************************************
	* Public Methods (with priveleged access)
	*******************************************/

	this.decrypt = function(str) {
		if (!privateKey)
			throw new Error("Need privateKey to decrypt")

		if (str == "") return ""
		try {
			if (DOUBLE_ENCRYPTION)
				str = CryptoJS.AES.decrypt(str, DUMBY_KEY).toString(CryptoJS.enc.Utf8)
			json = JSON.parse(str);
			encryptedData = json.ciphertext;
			encryptedKey = json.encryptedKeys[name];

			if (!encryptedKey)
				throw new Error("This message isn't meant for " + name)
	
			plainKey = getDecrypter().decrypt(encryptedKey);

			if (!plainKey)
				throw new Error("Could not decrypt symmetric key. Invalid publ/priv key?")

			plaintext = CryptoJS.AES.decrypt(encryptedData, plainKey).toString(CryptoJS.enc.Utf8);
			return plaintext;
		} catch (err) {
			console.group("Decryption")
			console.error(err.stack)
			console.groupEnd()
			return "Decryption failed"
		}
	}
	/**
	 * Encrypts text so only given recipients can decrypt it. 
	 * @param  {string} plainText  
	 * @param  {string[]} recipients An array of names of recipients
	 * @return {string}            Ciphertext
	 */
	this.encrypt = function(plainText, recipients) {
		console.group("Encryption")

		if (!keyring)
			throw new Error("Need a keyring to encrypt text")

		if (!recipients)
			recipients = []

		// ensure user's name is included
		if (recipients.indexOf(name) == -1) {
			recipients.push(name);
		}

		// generate random symmetric key
		plainKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		}); //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
		console.log("symmetric key: " + plainKey);

		// encrypt the text with it
		cipherText  = CryptoJS.AES.encrypt(plainText, plainKey).toString();

		// encrypt the key with each recipient's public key
		encryptedKeys = {}
		recipients.forEach(function(recipient) {

			if (!keyring.get(recipient))
				throw new Error("Recipient not found: " + recipient)

			pubEncrypter = new JSEncrypt();
			pubEncrypter.setPublicKey(keyring.get(recipient).publicKey)
			console.log("Using public Key: " + keyring.get(recipient).publicKey)
			encryptedKeys[recipient] = pubEncrypter.encrypt(plainKey);
			console.log("Encrypted key: " + encryptedKeys[recipient])
		})
	
		json = {
			"ciphertext": cipherText,
			"encryptedKeys": encryptedKeys
		}
	
		str = JSON.stringify(json)

		if (DOUBLE_ENCRYPTION)
			str = CryptoJS.AES.encrypt(str, DUMBY_KEY).toString();
		return str;
	}

	/**
	 * Encrypts texts so as to prove ownership of private key
	 * @param  {[type]} plainText [description]
	 * @return {[type]}           [description]
	 */
	this.sign = function(plainText) {
		throw new Error("not implemented")
	}

	/*******************************************
	* Private Methods
	*******************************************/
	function clone(obj) {
		return (obj == undefined) ? undefined : JSON.parse(JSON.stringify(obj))
	}
	function getDecrypter() {
		if (!privDecrypter) {
			privDecrypter = new JSEncrypt();
			privDecrypter.setPrivateKey(privateKey);
		}
		return privDecrypter
	}
}

Cipher.getTestCipherAlice = function() {
	var c = new Cipher(Keyring.getTestKeyringAlice(), "Alice") 
	return c
}
Cipher.getTestCipherBob = function() {
	var c = new Cipher(Keyring.getTestKeyringBob(), "Bob") 
	return c
}