var Settings = Settings || {};

function Settings(settingsData) {
	if (!settingsData) {
		throw new Error("Data cannot be null");
	}

	/*******************************************
	* Private Fields
	*******************************************/
	var settings = clone(settingsData);
	/*
		OBJECT STRUCTURE
		================
		settingsData: {
		  webapps: {
		    gmail: {
		      urls: string[],
		      highlightNodes: enum
		      enableOneLock: bool
		    facebook: {
		      urls: string[],
		      highlightNodes: enum
		      enableOneLock: bool
		    }   
		  }
		}
  	*/

	/*******************************************
	* Public Methods (with priveleged access)
	*******************************************/

	/**
	 * Get data used to persist to storage as a JSON object so it can be restored to memory as a Settings object again.
	 * @return {Object} 
	 */
	this.getData = function() {
		return clone(settings);
	};

	/**
	 * @return {Array} An array of urls for which this extension is "enabled"
	 */
	this.getEnabledUrls = function() {
		throw new Error("Not implemented");
	};

	/**
	 * @return {Object} An object containing settings for a specific url.
	 * @throws {Error} If url is not found.
	 */
	this.getSettingsForUrl = function() {

	};


	/*******************************************
	* Private Methods
	*******************************************/
	function clone(obj) {
		return (obj === undefined) ? undefined : JSON.parse(JSON.stringify(obj));
	}
}