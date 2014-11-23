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
	console.group("new Settings(data)");
	console.log(settingsData);
	console.groupEnd("new Settings(data)");
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
		console.group("Settings.getData()"); //debug
		console.debug(clone(settings)); //debug
		console.groupEnd("Settings.getData()"); //debug
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
		console.group("getSettingsForUrl");
		var returnVal;
		Object.keys(settings.webapps).every(function(key) {
			console.debug(settings.webapps[key]);
			webapp = new WebappSettings(settings.webapps[key]);
			console.debug(webapp);
			if (webapp.getUrls().indexOf(url) != -1) {
				returnVal = webapp;
				return false; // break
			}
			return true; // keep iteating
		});
		if (returnVal) {
			console.groupEnd("getSettingsForUrl");
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
					useOneLock: "1",
					modifiesClass: "_5yl5",
					displayName: "Facebook"
					// <span data-reactid=".1b.$mid=11408487379630=24a11c31db95be96322.2:0.0.0.0.0.0.$end:0:$0:0">MESSAGE HERE</span>
				},
				local: {
					urls: ["file:"],
					useOneLock: "1",
					modifiesClass: "encrypted",
					displayName: "local files"
				}
			}
		};
		return settingsData;
	}


	Settings.makeWebappSettings = function(webappSettingsData) {
		return new WebappSettings(webappSettingsData);
	};

	/*******************************************
	* Internal class
	*******************************************/
	function WebappSettings(webappSettingsData) {
		// private fields
		this.urls = webappSettingsData.urls;
		this.useOneLock = webappSettingsData.useOneLock;
		this.modifiesClass = webappSettingsData.modifiesClass;
		this.displayName = webappSettingsData.displayName;
	}
	WebappSettings.prototype.getData = function() {
		return clone({
			"urls": this.urls,
			"useOneLock": this.useOneLock,
			"modifiesClass": this.modifiesClass,
			"displayName": this.displayName,
		});
	};
	WebappSettings.prototype.getClass = function() {
		return clone(this.modifiesClass);
	};
	WebappSettings.prototype.getUrls = function() {
		return clone(this.urls);
	};
	WebappSettings.prototype.activatesOneLock = function() {
		return clone(this.useOneLock);
	};
	WebappSettings.prototype.getDisplayName = function() {
		return clone(this.displayName);
	};
}


Settings.getTestSettings = function() {
	var settingsData = {
		webapps: {
			facebook: {
				urls: ["facebook.com"],
				oneLockIsActive: true,
				modifiesClass: "_5yl5",
				displayName: "Facebook",
				// <span data-reactid=".1b.$mid=11408487379630=24a11c31db95be96322.2:0.0.0.0.0.0.$end:0:$0:0">MESSAGE HERE</span>
			}
		}
	};
	return new Settings(settingsData);
};

