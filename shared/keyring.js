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

Keyring.getTestKeyring = function() {
	var k = new Keyring();
	k.initialize();
	k.add("Alice", {
		signedName: "Jon Smithers",
		publicKey: "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB-----END PUBLIC KEY-----",
		privateKey: "-----BEGIN RSA PRIVATE KEY-----MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQABAoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fvxTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeHm7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAFz/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIMV7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATeaTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5AzilpsLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Ozuku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876-----END RSA PRIVATE KEY-----"
	});
	k.add("Bob", {
		signedName: "Billy Bob",
		publicKey: "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuTuucz6jrZQocV5sNFzXuuaKXGXb9oEIhThjCHDa3OsD5BkZ422h8JlByeOv/wmuC9b3Mkh1nu66PVAg3S+E6PasZZiy6tHcZOtK7DJemnLSVBOayjKJPWenC+cfc0AfC1oGzZajpbXzGdj7vEiBQwaRP7sAXCTO41YttuJp6nGRZ9sXi4mc0oTrJ4MYMTqIzLlbj+LT1lxZFcBRbJZ6qxCxpHOhuSpQ+VJyE81TBq15U/N9lxfws/2X3efhF+LEEBJHN9+H71SsEIez52R2/42E//2tM5jC0wWhtZ79FVoaWhG3m25gsaChOoO1+yHxxz/hveIjnxsRpA0g7NvjJQIDAQAB-----END PUBLIC KEY-----",
	})
	k.add("Freddy Freud", {
		signedName: "Freddy Freud",
		publicKey: "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvhr1doOTcOSyDvmrKGiZbB3sa02tp6tPOyHss31dhvJkOYGlJXTQuFsIAd+H+PIaDTEh4yguWh/q9T7SxDdDbUMDtZop0gtuWxTmmm2sTxjUpZA4RpAKVgOtwDTsGkceKVKk36O+asziW/UlgC940F7ZDUIzjR8oEJA0ot/mDRTFqkirYarFg10XnIjFW2Re3yoZHPNuP3Dpr7obLExmNwK0alllBd/50/htzY2lCWOLrGuhdUuf9JJ6+YZrVlZ0gpkA1620uNItcor6E/BKSMuxoax833viav+P1mZ2DRKjgu+rsVaerrxCibEOU/SGsVJMU/YiGbU2Qv7kQa0n0QIDAQAB-----END PUBLIC KEY-----"
	})
	return k
}
Keyring.getTestKeyring2 = function() {
	var k = new Keyring();
	k.initialize();
	k.add("Alice", {
		signedName: "Jon Smithers",
		publicKey: "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB-----END PUBLIC KEY-----",
	});
	k.add("Bob", {
		signedName: "Billy Bob",
		publicKey: "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuTuucz6jrZQocV5sNFzXuuaKXGXb9oEIhThjCHDa3OsD5BkZ422h8JlByeOv/wmuC9b3Mkh1nu66PVAg3S+E6PasZZiy6tHcZOtK7DJemnLSVBOayjKJPWenC+cfc0AfC1oGzZajpbXzGdj7vEiBQwaRP7sAXCTO41YttuJp6nGRZ9sXi4mc0oTrJ4MYMTqIzLlbj+LT1lxZFcBRbJZ6qxCxpHOhuSpQ+VJyE81TBq15U/N9lxfws/2X3efhF+LEEBJHN9+H71SsEIez52R2/42E//2tM5jC0wWhtZ79FVoaWhG3m25gsaChOoO1+yHxxz/hveIjnxsRpA0g7NvjJQIDAQAB-----END PUBLIC KEY-----",
		privateKey: "-----BEGIN RSA PRIVATE KEY-----MIIEpAIBAAKCAQEAuTuucz6jrZQocV5sNFzXuuaKXGXb9oEIhThjCHDa3OsD5BkZ422h8JlByeOv/wmuC9b3Mkh1nu66PVAg3S+E6PasZZiy6tHcZOtK7DJemnLSVBOayjKJPWenC+cfc0AfC1oGzZajpbXzGdj7vEiBQwaRP7sAXCTO41YttuJp6nGRZ9sXi4mc0oTrJ4MYMTqIzLlbj+LT1lxZFcBRbJZ6qxCxpHOhuSpQ+VJyE81TBq15U/N9lxfws/2X3efhF+LEEBJHN9+H71SsEIez52R2/42E//2tM5jC0wWhtZ79FVoaWhG3m25gsaChOoO1+yHxxz/hveIjnxsRpA0g7NvjJQIDAQABAoIBAQCHnxrrZkGRJZk26FtxO0j4nzNO04Vpxq/mWpKn63lTpv8CUx6RVgPrlUqF9x81LHEyWgJD3qm/5CqYGcL2L4SwzWsMN/FH3L/xZBVHOtnpW4iD5pa+1KGHRA0aue5dA+W2+gNhI5pOChokIqquAKgj2vseHlz1Gj4gVUjDTqMd8yoRnuAAOkF46MhT0cm+WyRPzD0i1gpoFJoFz/lxm7gVvsg++bRGjJJm9BbUwsi+Kpx0rRHYHqK6wqQnbXDyDEUrawq4tGvu2XVi+Y3BiuZO2DU3RNyv/TujE+kc3ShuU0oQjQ+k3XNN+DCAcdychT7Gep8rqAhv7cYzkzb9/fABAoGBANqnyeEDeOui6zBiLCWyxvD3lGaqMQMu2GcyKJQ8N94pDnrKiFKb5soS8rep8dvuPEGimt0sYaMg9RNKSUQmbsBErNpguqgeaJbaNY0L/EUrVWYGGK2pvjIrSMhabJm+4jXA2EhQWnbao/1r+dPb2mkJr6NzYs3o2lI6cjry7zXlAoGBANjelDwVtgdia+I5486kJ8cQjaBk3eBe9pMU9sArDLKb1i2k5iuEYFTb7NfQ7Et4dNTY/RWBanGh24m64KNu8ypWR1hVZhDhta9PKrXzF2aH1A4ppLMdIqI889elFjC+CPaW4a6JPJZhYeMZY2acwFiehuijv1WVhrYvrfaHryRBAoGBAIdEK5ifDExBsltxMDx2F6p0jwLgIIgGj+tvVTk285zlK0b9Sk5IkgLKrArBAJV9ERvNmx5eWVyQg+xWFXMqj3M0SPajxnVAspU4Es7Z7ktgHmmKNfQhQT9KFbGUdwC53LlCPsqlowFKCw84oAnXRYubaWOleydE+OLLs2USaredAoGAJIkzDgBWX14ccMtx7qFHNkk6ovf7TU6SWeshOvTFud15Ms1iHZi6pfE7MIy5EmnjvOwljxbzeNtc4hJCwCXz/4DzmhUhEd0Ev9klh+vBWHuvpQctASP6bry4E+9zEpkhZ3G56a6jL26OkDT5wxLLcOKcNdtIY8HCJTVZKHxpbEECgYAIvTbouf2Rps9Bn5rkJ0hKuHqxGeuB1nvTqoZGOH2nG+CnNUW/HTw8m4o+R5Zra7YHM8todSnEIJNQ7zGv9/t3Wut1arDG25CUG7n+Bo44c3lO6MNKvLCE8Pfs0XgaCp99MAD8wfJVN7b80d2u7sdWIxbR51AtUBT6Wfj9vR1M4A==-----END RSA PRIVATE KEY-----"
	})
	k.add("Freddy Freud", {
		signedName: "Freddy Freud",
		publicKey: "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvhr1doOTcOSyDvmrKGiZbB3sa02tp6tPOyHss31dhvJkOYGlJXTQuFsIAd+H+PIaDTEh4yguWh/q9T7SxDdDbUMDtZop0gtuWxTmmm2sTxjUpZA4RpAKVgOtwDTsGkceKVKk36O+asziW/UlgC940F7ZDUIzjR8oEJA0ot/mDRTFqkirYarFg10XnIjFW2Re3yoZHPNuP3Dpr7obLExmNwK0alllBd/50/htzY2lCWOLrGuhdUuf9JJ6+YZrVlZ0gpkA1620uNItcor6E/BKSMuxoax833viav+P1mZ2DRKjgu+rsVaerrxCibEOU/SGsVJMU/YiGbU2Qv7kQa0n0QIDAQAB-----END PUBLIC KEY-----"
	})
	return k
}
