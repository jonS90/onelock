$(function() {
	//VARIABLES
	JSON_FIELD = $("textarea");
	SUBMIT_BTN = $(".btn");
	STATUS = $("#status");

	SUBMIT_BTN.addClass('disabled');

	//for testing:
	// JSON_FIELD.val("-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzoWIXqCGKrIeFTHH2p5k\nzK6x3eOgFcaQLu7BVmwugZbvTseQoTrQx/wOXLh0G3fGb+jQTIcsCl57mxh2lHNX\nfkCJK5u4G+0WkwTS1AcdmqvQuhyyPg0+HbZahk4HwbbXFZWdHVHvelKcR1Zn3mKZ\nZmDWSLqHHbQpN1tu/u2IcbmG6uMPoK8aiVF2L0SHVtw/QRnXP5PKDz7pqmc1KieT\nC0MRRKV4nJ4L04rQind5UiiQFpF/LOBYNUFs3df9Pr2Yf9Xz3sdY87hP9h/HDvxU\nv9s8sFirV1npomHGCIG+MZVBU1ehzPbELpyo3i13oEi2SrVduLw1lJkO4NjwO4c1\noQIDAQAB\n-----END PUBLIC KEY-----");

	JSON_FIELD.on('keyup', validateAndEnable);

	SUBMIT_BTN.on('click', function() {
		console.group("Submit new contact");
		var newcontact = JSON_FIELD.val();
		var msg = {
			type: enums.messageType.ADD_CONTACT,
			contact: newcontact, 
			overwrite: false, 
		};
		chrome.runtime.sendMessage(msg, function(data) {
			if (data && data.success) {
				alert("Contact added");
				window.close();
			} else {
				alert("Failed to add contact");
			}
		});
		console.debug(msg);
		console.debug("sent message to add contact");
		console.groupEnd("Submit new contact");
	});
});

/****************************
* Helper methods
*****************************/
function formIsValid() {
	return true;
}
function validateAndEnable() {
	if (formIsValid()) {
		SUBMIT_BTN.removeClass('disabled');
	} else {
		SUBMIT_BTN.addClass('disabled');
	}
}