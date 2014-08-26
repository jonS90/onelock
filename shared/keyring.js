var keyring = {}

/****************************************
* Public API
****************************************/

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
