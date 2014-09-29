/*
 * Cipher provides methods to for encryption. 
 * (Depends on jsencrypt and Keyring)
 */
var Cipher = Cipher || {}

/**
 * Instantiates a Cipher object.
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

		if (!(recipients instanceof Array))
			throw new Error("Recipients is not an array");

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
				throw new Error("Recipient not found: \"" + recipient + "\"");

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
		var signer = new JSEncrypt();
		signer.setPublicKey();
		//!!!!! I"M HERE
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
Cipher.generateKey = function(callback) {
	console.time("Generate key");
    var crypt = new JSEncrypt({default_key_size: 1024}); //1024
    crypt.getKey(function() {
    	console.timeEnd("Generate key")
    	callback(crypt.getPrivateKey(), crypt.getPublicKey())
    });
}
Cipher.getTestCipherAlice = function() {
	var c = new Cipher(Keyring.getTestKeyringAlice(), "Alice") 
	return c
}
Cipher.getTestCipherBob = function() {
	var c = new Cipher(Keyring.getTestKeyringBob(), "Bob") 
	return c
}
Cipher.getTestKeyringFresh = function() {
	var c = new Cipher(Keyring.getTestKeyRingFresh(), "Newbie")

}