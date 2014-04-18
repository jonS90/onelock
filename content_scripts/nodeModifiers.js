var nodeModifiers = {};

{
				  ensureID = function(node) { 
				  	if (!node.attr('id')) 
				  		node.attr('id', "uid-" + Math.random().toString().slice(2)); 
				  };
				  makePortable = function(node) {
				  	ensureID(node);
				  	var obj = {
				  		id: node.attr('id'),
				  		html: node.html(),
				  		css: getAllCSS(node)
				  	}
				  	return obj ;
				  };
				  getAllCSS = function(node) {
				  	var allCss = {
				  		"width": node.css('width'),
				  		"height": node.css('height'),
				  		"background-color": node.css('background-color'),
				  		"color": node.css('color'),
				  		"letter-spacing": node.css('letter-spacing'),
				  		"line-height": node.css('line-height'),
				  		"text-align": node.css('text-align'),
				  		"text-decoration": node.css('text-decoration'),
				  		"text-indent": node.css('text-indent'),
				  		"text-shallow": node.css('text-shallow'),
				  		"text-transform": node.css('text-transform'),
				  		"word-spacing": node.css('word-spacing'),
				  		"font": node.css('font'),
				  		// sdfsdf: node.css('sdfsdf'),
				  	};
				  	return allCss;
				  };
				  // myTabId = null;
				  // haveMyTab = function(callback) {
				  // 	if (!myTabId)
				  // 		chrome.tabs.query(
				  // 			{active: true, currentWindow: true}, 
				  // 			function(tabs) {
				  // 				myTabId = tabs[0].id
				  // 				callback();
				  // 			});
				  // 	else callback();
				  // }

	              markNode     = function(node) {           node.text(node.text() + " `") }
	nodeModifiers.isNodeMarked = function(node) {	return (node.text().slice(-2) == " `") }

	decryptText = function(ciphertext) {
	    var password = "sdflkjweljsflkjsdflkjsdflkjsdfkljsdflkjsdflkj";
	    var plaintext  = CryptoJS.AES.decrypt(ciphertext, password).toString(CryptoJS.enc.Utf8);
	    if (plaintext == "") plaintext = "decryption failed"
	    return plaintext
	}

	

	nodeModifiers.clickNodeToEditValue = function(node) {
		var updateNodeInPage = function(portableNode) {
			alert("I GOT A RESPONSE")
			// $('#' + portableNode.id).html(portableNode.html)
		}
		
		node.off('click.editInPopup')
		var text = node.val();
		node.on('click.editInPopup', function() {
			console.log("webpage wants to edit text");
			chrome.runtime.sendMessage(
				{
					type: "decrypt and edit", 
					ciphertext: text, 
					node: makePortable(node)
				});
		})
	}

	nodeModifiers.clickNodeToDecryptText = function(node) {
		node.off('click.decryptToPopup')
		var text = node.text()
		node.on('click.decryptToPopup', function() {
			console.log("webpage sending text: " + text)
			chrome.runtime.sendMessage(
				{type: "decrypt and show", ciphertext: text, node: makePortable(node)}
				)
			// chrome.notifications.create({TemplateType: "basic", title: "Decryption", message: text})
		})
		
		markNode(node);
	}

	nodeModifiers.decryptTextInPlace = function(node) {
		node.text(decryptText(node.text()));
		markNode(node);
	}
}