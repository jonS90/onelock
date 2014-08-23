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
		//when a safe_view popup/iframe is getting ciphertext from the eventPage
		GET_CIPHERTEXT: 1,
		//when someplace is adding
		ADD_CONTACT: 2,

	}
}



enums.getEditName = function(myenum) {
	switch (myenum) {
		case (enums.edit.popup):
			return "popup"
			break;
		case (enums.edit.iframe):
			return "iframe"
			break;
		case (enums.edit.inplace):
			return "inplace"
			break;
		default: throw (myenum + " not found")
	}
}

enums.getDisplayName = function(myenum) {
	switch (myenum) {
		case (enums.display.popup):
			return "popup"
			break;
		case (enums.display.iframe):
			return "iframe"
			break;
		case (enums.display.inplace):
			return "inplace"
			break;
		default: throw (myenum + " not found")
	}
}


if (typeof nodeModifiers != 'undefined') {
	enums.getEditMethod = function(myenum) {
		switch (myenum) {
			case "popup": //(enums.edit.popup):
				return nodeModifiers.clickNodeToDecryptText;
				break;
			case "iframe": //(enums.edit.iframe):
				throw "not implemented"
			case "inplace": //(enums.edit.inplace):
				throw "not implemented"
			default: throw "not found"
		}
	}

	enums.getDisplayMethod = function(myenum) {
		switch(myenum) {
			case "in-place": //(enums.display.inplace):
				return nodeModifiers.decryptTextInPlace;
				break;
			case "popup": //(enums.display.popup):
				return nodeModifiers.clickNodeToDecryptText;
				break;
			default: throw "method not found"
		}
	}
}
