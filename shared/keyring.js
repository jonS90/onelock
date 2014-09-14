/**
 * Keyring manages modifications to a keyring data structure. Can be persisted by storing the return value of getData(), and restoring with loadData().
 */
var Keyring = Keyring || {}

function Keyring() {
	/*******************************************
	* Private Fields
	*******************************************/
	var keyCollection; // an object mapping names to contact-data
	var nameKeys; // an array of all the names in the keyCollection
	var count; // a count of entries in keyCollection and nameKeys

	/*******************************************
	* Public Methods (with priveleged access)
	*******************************************/

	/**
	 * Behavior is undefined unless you call this or initialize()
	 * @param  {[type]} retrievedData [description]
	 * @return {[type]}               [description]
	 */
	this.loadData = function(retrievedData) {
		keyCollection = retrievedData.keyCollection
		nameKeys = retrievedData.nameKeys
		count = retrievedData.count

		this.initialize()
	}
	/**
	 * Returns an object which can be used to restore the keyring. 
	 * (This exists because chrome storage strips objects of their functions)
	 * @return {[type]} [description]
	 */
	this.getData = function() {
		var keyData = {
			keyCollection: keyCollection,
			nameKeys: nameKeys,
			count: count
		}
		console.group("exporting key")
		console.log(keyData)
		console.groupEnd()
		return clone(keyData);
	}

	/**
	 * Behavior is undefined unless you call this or loadData.
	 * @return {[type]} [description]
	 */
	this.initialize = function() {
		keyCollection = keyCollection || {}
		nameKeys = nameKeys || []
		count = count || 0
	}

	/**
	 * Adds an entry tot he keyring
	 * @param {string} name  [description]
	 * @param {object} value [description]
	 */
	this.add = function(name, value) {
		if (name == undefined || value == undefined)
			throw new Error("Param cannot be null")

		if (keyCollection[name] == undefined) {
			keyCollection[name] = value;
			nameKeys.push(name);
			count++
			return true
		} else {
			return false
		}
	}	

	/**
	 * Gets the data for a name
	 * @param  {string} name Name of contact
	 * @return {object}      Undefined if not found.
	 */
	this.get = function(name) {
		return clone(keyCollection[name])
	}

	/**
	 * Removes the entry for the name
	 * @param  {string} name 
	 * @return {boolean}      True if item removed, false if not found.
	 */
	this.remove = function(name) {
		if (keyCollection[name] != undefined) {
			console.group("Removing key enry"); console.debug(nameKeys)

			delete keyCollection[name]
			nameKeys.splice(nameKeys.indexOf(name), 1)
			count--

			console.debug(nameKeys);console.groupEnd()
			return true

		} else {
			return false
		}
	}

	/**
	 * Iterates through all keys in keyring
	 * @param  {function} func Called as function(name, data)
	 */
	this.forEach = function(func) {
		//prepare access to this.get()
		var scopeGet = this.get

		nameKeys.forEach(function(nameKey) {
			func(nameKey, scopeGet(nameKey))
			//func(name, clone(keyCollection[name]))
		});
	}

	/**
	 * Returns a list of the unique names of everyone in the keyring.
	 * @return {string[]} The array of names
	 */
	this.getNames = function() {
		return clone(nameKeys);
	}

	/*******************************************
	* Private Methods
	*******************************************/

	function clone(obj) {
		return (obj == undefined) ? undefined : JSON.parse(JSON.stringify(obj))
	}
}

Keyring.getTestKeyringAlice = function() {
	var k = new Keyring();
	k.initialize();
	k.add("Alice", {
		signedName: "Jon Smithers",
		publicKey: "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyOL1AfchXjYMPushll5eQQScT4p96Yw7Iqx1071N27/3tczZY4IDuFJck5tZjSF+5iQhu/ei0tunkFXA4KhTzQGk7I7Wuh1thPXt5UXtQrUfANu8gYLXigQ3P+u8VKaptPCqx9S631m6Aeka4Ux+co3AV6rdLKlhkHXQ3tYY7tAuNcAqprs67buKwVcBdnsDB2VhB4cCTokX8rwxG9jQb2KZrPCMs2sAHoRQIf0zj2QgWWCeOdh1E2O/eEIF+zreqwEVO/bJaNEQQLwrHlFyLBrrhf2iFOuy8K73fXlm2wy97g0K02PMYwuwja0bQoy9hD2QnUcHDLolc+m57EEFBQIDAQAB-----END PUBLIC KEY-----",
		privateKey: "-----BEGIN RSA PRIVATE KEY-----MIIEpAIBAAKCAQEAyOL1AfchXjYMPushll5eQQScT4p96Yw7Iqx1071N27/3tczZY4IDuFJck5tZjSF+5iQhu/ei0tunkFXA4KhTzQGk7I7Wuh1thPXt5UXtQrUfANu8gYLXigQ3P+u8VKaptPCqx9S631m6Aeka4Ux+co3AV6rdLKlhkHXQ3tYY7tAuNcAqprs67buKwVcBdnsDB2VhB4cCTokX8rwxG9jQb2KZrPCMs2sAHoRQIf0zj2QgWWCeOdh1E2O/eEIF+zreqwEVO/bJaNEQQLwrHlFyLBrrhf2iFOuy8K73fXlm2wy97g0K02PMYwuwja0bQoy9hD2QnUcHDLolc+m57EEFBQIDAQABAoIBAFobEvKyutDbRVrjdMlRws0/GC3FXPzo3Y2L9b3n54ht7too7ElqA+klaEj9IYngQF9STZ9WUD5sMBjZng4m8o+98Q/6ce5BTOKavP5eAzIss59a8I7W9X7+rRmKz4rYxr5WRQQlMz0Drh81Q81S1lTjqCaqiVKDFzQI5ItPVReolXXiDH/PsB4il904OiAnpVDCgV7I3dY+0ddNezdO44Cs+RcAVm7gTrE8Cv/MIfUjUnxbVwMczwgUn88Tomv9ygR+3F5htnubBqM0nI+EVXWDaLEVyy2g5NM51h+qnZ6XSdKZz5swZXMtZxJbYOjEaxofnc0Ho7synpZ/BoTQjHECgYEA8dCizbn0SBRq47+tE1ZbM2UGlqJIlaTCagaZDOM0SgDMBneoLkYcfJD+TIwvPEGy7pn7vSCFqy4z1Ftkj8bLiSXAVbj+1tJIbfBkFhyiLolzU5fNvcWaNOm9GhKHksXp8f+AHOWTAigY96IzvM/Ey6mX8FuEQp6ln4hOtYDNybcCgYEA1KuxqxPlFMv8Dm6pInqKJgVNY7n6JKIAkug09HS/vcm/Eodx+9oJY2MSL8qw7veI7cDObxBNgovN7e/dEMT/N/X4Y5JzrD7OkAGW5Bj7Mf4xT4E8x0ND0NP+SgToTrCqMgQL88XBdQdDcxQR6pZEGL4GJ04mP52S/gVDv2D5FyMCgYEAgkUtj7r/+NzXAL7AFMzO8Q8Zz4i5pbRO8COBzEmSX9OyFkHcHqGyswDBnqdeww15wcS+s5KTsDaBwYNC15n3CHmH9iZlU4GRd3ir0qW2UW/G61+6fOO5QYwyTZtx4gYxFCfa8rZSzjSfzrhZOvyLPlSs/9WtmN4yx5D9Jhavxl0CgYBJ97WBtRe2FgSC2IZHEau+8ZUrHGIeH6JndhAE/h46WlL0lNtWJ02gnbKToMHNO5cKakbiZh8vSoTDPuv6iynhQtGzgBpvTCD4ATWD/BRSHQD1kBOdko2hsjn9cJuD0vo/Dx1BGgThOTeCbPaWStFAccceIJY5Bgs8AoS/qXC5VQKBgQDwY5gxunrGUBn59sdQS7tKNJpRvaGlDkd4zsbkirQonGsLRfyV4lzWztekvEqg1iCZYsp0/NyWnbOKrvoBxl7DE15wmIXpz6JYllGHOk102Z1ohLPEuFk7ZNzQ4OKDVnSLPKouX3sfzc2lTN2Tey2/h44guv8ks3cRfeNAvLjfVg==-----END RSA PRIVATE KEY-----"
	});
	k.add("Bob", {
		signedName: "Billy Bob",
		publicKey: "-----BEGIN PUBLIC KEY-----\nMIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHVoeZNm0mcNFGYJdlwT38XM6M6M\nr9Wj7m4Fn5KYpjJssF1MzjGreTTH/wC1E1qDpi3jtxfCAlbfEeOTChPywDRQzYXz\nslU0xQZSvgE0F2OZOj7a5FBj6iHJiD0az7s0RClEAT1elJM5zYXua7RdxhYVp3Ec\nydxobAq4OI0vupYPAgMBAAE=\n-----END PUBLIC KEY-----"
	})
	k.add("Freddy Freud", {
		signedName: "Freddy Freud",
		publicKey: "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvhr1doOTcOSyDvmrKGiZbB3sa02tp6tPOyHss31dhvJkOYGlJXTQuFsIAd+H+PIaDTEh4yguWh/q9T7SxDdDbUMDtZop0gtuWxTmmm2sTxjUpZA4RpAKVgOtwDTsGkceKVKk36O+asziW/UlgC940F7ZDUIzjR8oEJA0ot/mDRTFqkirYarFg10XnIjFW2Re3yoZHPNuP3Dpr7obLExmNwK0alllBd/50/htzY2lCWOLrGuhdUuf9JJ6+YZrVlZ0gpkA1620uNItcor6E/BKSMuxoax833viav+P1mZ2DRKjgu+rsVaerrxCibEOU/SGsVJMU/YiGbU2Qv7kQa0n0QIDAQAB-----END PUBLIC KEY-----"
	})
	return k
}
Keyring.getTestKeyringBob = function() {
	var k = new Keyring();
	k.initialize();
	k.add("Alice", {
		signedName: "Jon Smithers",
		publicKey: "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyOL1AfchXjYMPushll5eQQScT4p96Yw7Iqx1071N27/3tczZY4IDuFJck5tZjSF+5iQhu/ei0tunkFXA4KhTzQGk7I7Wuh1thPXt5UXtQrUfANu8gYLXigQ3P+u8VKaptPCqx9S631m6Aeka4Ux+co3AV6rdLKlhkHXQ3tYY7tAuNcAqprs67buKwVcBdnsDB2VhB4cCTokX8rwxG9jQb2KZrPCMs2sAHoRQIf0zj2QgWWCeOdh1E2O/eEIF+zreqwEVO/bJaNEQQLwrHlFyLBrrhf2iFOuy8K73fXlm2wy97g0K02PMYwuwja0bQoy9hD2QnUcHDLolc+m57EEFBQIDAQAB-----END PUBLIC KEY-----",
	});
	k.add("Bob", {
		signedName: "Billy Bob",
		privateKey: "-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgHVoeZNm0mcNFGYJdlwT38XM6M6Mr9Wj7m4Fn5KYpjJssF1MzjGr\neTTH/wC1E1qDpi3jtxfCAlbfEeOTChPywDRQzYXzslU0xQZSvgE0F2OZOj7a5FBj\n6iHJiD0az7s0RClEAT1elJM5zYXua7RdxhYVp3EcydxobAq4OI0vupYPAgMBAAEC\ngYBBy62uLEYnGA5hbFYXHdAeskmZTwBPEpJQt/gIGGGzCnP/pUY8UaMYMCg4xkE1\nTWe4ec+mkcPr2RDWXxWbvkN1iyZ6cjZQ6TW2qx/kyX+eJxbmHEGIe7inHqdi8k8T\nAPtXsih+eQuPT+sAJ+4FmwVuPyeoRf/agt+MmriRO/rmaQJBALqqdpBTFSKFpSl2\nsNVGtEvD+ggZq74CInn/gyxoZ3IYEYDlUP6cDSs5i6EehpWU0zQywBdvQd+eImuj\nMJl6eB0CQQChBHvnm7QIhsxvoFqSfZKg7LGUp0U8dTXxL9fbao8ql7XVDKdkfowK\niHZTa5Kiu8f37AOPKCYRmNT0XZJBOacbAkAeshNnLlJmZ+W+CMeRetwBLYv7MwV7\n7Gvw9eSDM/P23iBautrz04OS3Rap+xQUmvGUPtg5wlDpzd5JJv/B7VK9AkEAjwzc\nx7edCrY3ijR8Qwks66tdWSQCbuPzOIO40kapSr3d3ZmQXcfPwsvZ0+MOM2WBEtGr\nl9Ojfp65EyDOfwQpYQJBAK0YFSC41AHFaDZ5XaHg2DKyahC9APfAaGFnwXliaGd3\nWZSBXKB/914+eQvJllawTkjKg1peqJ0EK0IBkK3k8yQ=\n-----END RSA PRIVATE KEY-----",
		publicKey: "-----BEGIN PUBLIC KEY-----\nMIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHVoeZNm0mcNFGYJdlwT38XM6M6M\nr9Wj7m4Fn5KYpjJssF1MzjGreTTH/wC1E1qDpi3jtxfCAlbfEeOTChPywDRQzYXz\nslU0xQZSvgE0F2OZOj7a5FBj6iHJiD0az7s0RClEAT1elJM5zYXua7RdxhYVp3Ec\nydxobAq4OI0vupYPAgMBAAE=\n-----END PUBLIC KEY-----"
	})
	k.add("Freddy Freud", {
		signedName: "Freddy Freud",
		publicKey: "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvhr1doOTcOSyDvmrKGiZbB3sa02tp6tPOyHss31dhvJkOYGlJXTQuFsIAd+H+PIaDTEh4yguWh/q9T7SxDdDbUMDtZop0gtuWxTmmm2sTxjUpZA4RpAKVgOtwDTsGkceKVKk36O+asziW/UlgC940F7ZDUIzjR8oEJA0ot/mDRTFqkirYarFg10XnIjFW2Re3yoZHPNuP3Dpr7obLExmNwK0alllBd/50/htzY2lCWOLrGuhdUuf9JJ6+YZrVlZ0gpkA1620uNItcor6E/BKSMuxoax833viav+P1mZ2DRKjgu+rsVaerrxCibEOU/SGsVJMU/YiGbU2Qv7kQa0n0QIDAQAB-----END PUBLIC KEY-----"
	})
	return k
}