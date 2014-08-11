$(function() {
	//VARIABLES
	CONTACT_NAME = $("#displayName");
	CONTACT_KEY = $("textarea");
	SUBMIT_BUTTON = $(".btn");
	DEFAULT_NAME_VALUE = CONTACT_NAME.val();
	DEFAULT_KEY_VALUE = CONTACT_KEY.val(); 
	DEFAULT_COLOR = CONTACT_NAME.css('color');
	GRAYED_COLOR = "gray";
	STATUS = $("#status");

	CONTACT_NAME.css('color', GRAYED_COLOR);
	CONTACT_KEY.css('color', GRAYED_COLOR);
	SUBMIT_BUTTON.prop('disabled', true);

	//for testing:
	CONTACT_KEY.val("-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzoWIXqCGKrIeFTHH2p5k\nzK6x3eOgFcaQLu7BVmwugZbvTseQoTrQx/wOXLh0G3fGb+jQTIcsCl57mxh2lHNX\nfkCJK5u4G+0WkwTS1AcdmqvQuhyyPg0+HbZahk4HwbbXFZWdHVHvelKcR1Zn3mKZ\nZmDWSLqHHbQpN1tu/u2IcbmG6uMPoK8aiVF2L0SHVtw/QRnXP5PKDz7pqmc1KieT\nC0MRRKV4nJ4L04rQind5UiiQFpF/LOBYNUFs3df9Pr2Yf9Xz3sdY87hP9h/HDvxU\nv9s8sFirV1npomHGCIG+MZVBU1ehzPbELpyo3i13oEi2SrVduLw1lJkO4NjwO4c1\noQIDAQAB\n-----END PUBLIC KEY-----");


	CONTACT_NAME.on('focus', function() {
		if (CONTACT_NAME.val() == DEFAULT_NAME_VALUE) {
			CONTACT_NAME.val("");
			CONTACT_NAME.css('color', DEFAULT_COLOR)
		}
	})
	CONTACT_NAME.on('blur', function() {
		if (CONTACT_NAME.val() == "") {
			CONTACT_NAME.val(DEFAULT_NAME_VALUE);
			CONTACT_NAME.css('color', GRAYED_COLOR);
		}
	})

	CONTACT_KEY.on('focus', function() {
		if (CONTACT_KEY.val() == DEFAULT_KEY_VALUE) {
			CONTACT_KEY.val("");
			CONTACT_KEY.css('color', DEFAULT_COLOR);
		}
	})
	CONTACT_KEY.on('blur', function() {
		if (CONTACT_KEY.val() == "") {
			CONTACT_KEY.val(DEFAULT_KEY_VALUE);
			CONTACT_KEY.css('color', GRAYED_COLOR);
		}
	})


	//form validation
	CONTACT_KEY.on('change', onchange);
	CONTACT_NAME.on('change', onchange);
	onchange = function() {
		if (formIsValid()) {
			SUBMIT_BUTTON.prop('disabled', false);
		} else {
			SUBMIT_BUTTON.prop('disabled', true);
		}
	}

	SUBMIT_BUTTON.on('click', function() {
		if (!formIsValid) {
			console.log("sdf");
			STATUS.text("Please check for invalid fields")
		} else {
			// keyring.add(CONTACT_NAME.val(), CONTACT_KEY.val()
			// TODO I Just realized I have to use message passing to add keys...
		}
	})
})

/****************************
* Helper methods
*****************************/
var formIsValid = function() {
	namePresent = CONTACT_NAME.val() != "" && CONTACT_NAME.val() != DEFAULT_NAME_VALUE;
	keyPresent = utils.validatePublicKey(CONTACT_KEY.val());
	console.log(namePresent)
	console.log(keyPresent)
	return namePresent && keyPresent;
}
