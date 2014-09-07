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