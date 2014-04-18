var nodeModifierEnums = {
	displayEnum: {
		inPlace: 0,
		inPopup: 1
	},
	editEnum: {
		inPopup: 0,
	}
}

if (nodeModifiers) {
	nodeModifierEnums.getEditModifier = function(enum) {
		switch (enum) {
			case (nodeModifierEnums.editEnum.inPopup):
			return nodeModifiers.clickNodeToDecryptText;
		}
	}

	nodeModifierEnums.getDisplayModifier = function(enum) {
		switch(enum) {
			case (nodeModifiers.displayEnum.inPlace):
			return nodeModifiers.decryptTextInPlace;
			case (nodeModifiers.displayEnum.inPopup):
			return nodeModifiers.clickNodeToDecryptText;
		}
	}
}



