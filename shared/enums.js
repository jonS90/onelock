var enums = {
	display: {
		popup: 0,
		iframe: 1,
		inplace: 2
	},
	edit: {
		popup: 3,
		iframe: 4,
		inplace: 5
	},
	messageType: {
		
		//when a contentscript requests to decrypt something, possibly as editable
		DECRYPT_AND_SHOW: 0,
		//when a view_sensitive_text popup/iframe is getting ciphertext from the eventPage
		GET_CIPHERTEXT: 1,
		//when someplace is adding
		ADD_CONTACT: 2,
		//when contentscript says to show page action
		SHOW_PAGEACTION: 3,
		//when sharing owner's public key with friends
		GET_PUBLICKEY: 4,

	}
};



enums.getEditName = function(myenum) {
	switch (myenum) {
		case (enums.edit.popup):
			return "popup";
		case (enums.edit.iframe):
			return "iframe";
		case (enums.edit.inplace):
			return "inplace";
		default: throw (myenum + " not found");
	}
};

enums.getDisplayName = function(myenum) {
	switch (myenum) {
		case (enums.display.popup):
			return "popup";
		case (enums.display.iframe):
			return "iframe";
		case (enums.display.inplace):
			return "inplace";
		default: throw (myenum + " not found");
	}
};


if (typeof nodeModifiers != 'undefined') {
	enums.getEditMethod = function(myenum) {
		switch (myenum) {
			case "popup": //(enums.edit.popup):
				return nodeModifiers.clickNodeToDecryptText;
			case "iframe": //(enums.edit.iframe):
				throw "not implemented";
			case "inplace": //(enums.edit.inplace):
				throw "not implemented";
			default: throw "not found";
		}
	};

	enums.getDisplayMethod = function(myenum) {
		switch(myenum) {
			case "in-place": //(enums.display.inplace):
				return nodeModifiers.decryptTextInPlace;
			case "popup": //(enums.display.popup):
				return nodeModifiers.clickNodeToDecryptText;
			default: throw "method " + myenum + " not found";
		}
	};
}
