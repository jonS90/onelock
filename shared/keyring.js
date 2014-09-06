var keyring = {} //todo remove

/****************************************
* Public API
****************************************/

var Keyring = Keyring || {}

function Keyring() {
	//http://javascript.crockford.com/private.html

	//private fields ============================
	var keyCollection;
	var nameKeys;
	var count

	//public (but privileged) methods ===========
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
	this.getData = function() {
		//return a clone of the object
		var keyData = {
			keyCollection: keyCollection,
			nameKeys: nameKeys,
			count: count
		}
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
	this.add = function(name, value) {
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
			delete keyCollection[name]
			console.log(nameKeys)
			nameKeys.splice(nameKeys.indexOf(name), 1)
			console.log(nameKeys)
			count--
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

	// private methods ===========================
	function clone(obj) {
		return (obj == undefined) ? undefined : JSON.parse(JSON.stringify(obj))
	}
}

/**
 * Initialize
 * @param  {object} keyring from chrome.storage
 */
keyring.initialize = function(stored_keyring) {
	keyring.list = stored_keyring

	fuseOptions = {
		caseSensitive: false,
		shouldSort: true,
		maxPatternLength: 32,
		threshold: 0.6,
		distance: 100,
		keys: keyring.SEARCHKEYS
	}
	keyring.fuse = new Fuse(keyring.list, fuseOptions);
}

/**
 * Adds a contact to keyring. This isn't persistent, mind you...until you save keyring.getKeyringData()
 * @param {[type]} displayName
 * @param {[type]} publicKey
 */
keyring.add = function(displayName, publicKey) {
	throw "not implemented"

	// I MAY or MAY NOT need to update Fuse for fuzzy search
	//keyring.initialize(keyring.getKeyringData());

	// Also, make sure you do some kind of format check on the publicKey
}

/**
 * Store the return value persistently, and you can restore the keyring's state in the future. 
 * @return {object} Object to be stored persistently
 */
keyring.getKeyringData = function() {
	return keyring.list
}

/**
 * Return a sorted list of fuzzy matches.
 * @return {[type]}
 */
keyring.fuzzySearch = function(search_string) {
	return keyring.fuse.search(search_string);
}

/****************************************
* "Private" stuff
****************************************/

keyring.SEARCHKEYS = ["displayName"]
