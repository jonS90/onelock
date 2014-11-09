var Settings = Settings || {};

/**
 * [Settings description]
 * @param {object} settingsData An unaltered object obtained from
 *     Settings.getData(). Pass nothing to initialize from scratch.
 */
function Settings(settingsData) {
	if (typeof settingsData === "undefined") {
		settingsData = getBaselineSettingsData();
	}
	else if (!settingsData) {
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
	* Public Methods
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
		var enabledUrls = [];

		Object.keys(settings.webapps).forEach(function(key) {
			webapp = new WebappSettings(settings.webapps[key]);
			webapp.getUrls().forEach(function(url) {
				enabledUrls.push(url);
			});
		});

		return enabledUrls;
	};

	/**
	 * @param  {String} url 
	 * @return {Object} An object containing settings for specified url
	 * @throws {Error} If url is not found
	 */
	this.getSettingsForUrl = function(url) {
		var returnVal;
		Object.keys(settings.webapps).every(function(key) {
			webapp = new WebappSettings(settings.webapps[key]);
			if (webapp.getUrls().indexOf(url) != -1) {
				returnVal = webapp;
				return false; // break
			}
			return true; // keep iteating
		});
		if (returnVal) {
			return returnVal;
		} else {
			throw new Error("This url not found: \"" + url + "\"");
		}
	};


	/*******************************************
	* Private Methods
	*******************************************/
	function clone(obj) {
		return (obj === undefined) ? undefined : JSON.parse(JSON.stringify(obj));
	}
	function getBaselineSettingsData() {
		var settingsData = {
			webapps: {
				facebook: {
					urls: ["facebook.com"],
					enableOneLock: true,
					modifyClass: "_5yl5"
					// <span data-reactid=".1b.$mid=11408487379630=24a11c31db95be96322.2:0.0.0.0.0.0.$end:0:$0:0">MESSAGE HERE</span>
				}
			}
		};
		return settingsData;
	}


	/*******************************************
	* Internal class
	*******************************************/
	function WebappSettings(webappSettingsData) {
		// private fields
		this.urls = webappSettingsData.urls;
		this.enableOneLock = webappSettingsData.enableOneLock;
		this.modifyClass = webappSettingsData.modifyClass;
	}
	WebappSettings.prototype.getData = function() {
		return clone({
			"urls": this.urls,
			"enableOneLock": this.enableOneLock,
			"modifyClass": this.modifyClass,
		});
	};
	WebappSettings.prototype.getClass = function() {
		return clone(this.modifyClass);
	};
	WebappSettings.prototype.getUrls = function() {
		return clone(this.urls);
	};
}


Settings.getTestSettings = function() {
	var settingsData = {
		webapps: {
			facebook: {
				urls: ["facebook.com"],
				enableOneLock: true,
				modifyClass: "_5yl5"
				// <span data-reactid=".1b.$mid=11408487379630=24a11c31db95be96322.2:0.0.0.0.0.0.$end:0:$0:0">MESSAGE HERE</span>
			}
		}
	};
	return new Settings(settingsData);
};

