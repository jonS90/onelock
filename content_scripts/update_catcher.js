  var observer = {};

  /* observeChanges
   * Creates a mutation observer which detects insertions and modifications of certain nodes.
   * param     str  desiredClass        nodes of this class will be observed
   * param     str  modifyText(str)     used to update the text of each node detected. Must accept a string and return a string.
   * param     bool modifiedText(str)   used to detect if the text the node has been detected. This MUST BE TRUE after calling modifyText, and false before calling modifyText. (This is here to prevent infinite recursion so-to-speak). Must accept a string and return a boolean.
   */
  observer.observeChanges = function(desiredClass, modifyText, modifiedText) {
      var arrayContains = function(a, obj) {
          var i = a.length;
          while (i--) {
             if (a[i] === obj) {
                 return true;
             }
          }
          return false;
      }; //http://stackoverflow.com/questions/237104/array-containsobj-in-javascript



      var docObserver = new WebKitMutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                //mutation type: characterData
                if (arrayContains(!!mutation.target.parentNode.className &&
                                    mutation.target.parentNode.className.split(" "), desiredClass)) {
                    var text = mutation.target.data;
                    
                    if (!modifiedText(text)) {
                        console.log("update: " + text);
                        mutation.target.data = modifyText(mutation.target.data);    
                    }
                } 
                
                //mutation type: childList
                else if (mutation.addedNodes.length >= 1) {
                    var nodes = Array.prototype.slice.call(mutation.addedNodes,0);
                    nodes.forEach(function(addedNode) {
                        //handle the node itself
                        if (addedNode.classList && addedNode.classList.contains(desiredClass)) {
                            console.log("insert: " + addedNode.innerHTML); 
                            addedNode.innerHTML = modifyText(addedNode.innerHTML);
                        }

                        //handle the node's descendents
                        else $(addedNode).find('.' + desiredClass).each(function() {//.css( "background-color", "red" );
                            console.log("insert child: " + $(this).html())
                            $(this).html(modifyText($(this).html()))
                        });
                    });
                }
            });
      });

      //                                            v -new nodes
      docObserver.observe(document, {subtree: true, childList: true, characterData: true});
      //                                                             ^ -new text in old nodes
      console.log("observing for " + desiredClass)
  };

  observer.changeText = function(str) {
      return (str + " !i!"); //¤
  };
  observer.textHasChanged = function(str) {
      //return (str.indexOf("¤") == 0);
      return (!str || str.slice(-4) == " !i!"); //I might consider adding an invisible child node
  };

  // observeChanges("c", changeText, textHasChanged);
