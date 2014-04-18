console.log("hi")
console.log(observer)

decryptText = function(node) {
	node.off('click.decrypt')
	node.on('click.decrypt', function() {alert('you clicked an encrypted element')})
	node.text(node.text() + " `")
}

observer.observeChanges("c", nodeModifiers.clickNodeToDecryptText, observer.nodeIsModified);	