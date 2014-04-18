  var observer = {};

  /* observeChanges
   * Creates a mutation observer which detects insertions and modifications of certain nodes.
   * param     str  desiredClass        nodes of this class will be observed
   * param     str  modifyText(str)     used to update the text of each node detected. Must accept a string and return a string.
   * param     bool modifiedText(str)   used to detect if the text the node has been detected. This MUST BE TRUE after calling modifyText, and false before calling modifyText. (This is here to prevent infinite recursion so-to-speak). Must accept a string and return a boolean.
   */
  observer.observeChanges = function(desiredClass, modifyNode, nodeIsModified) {
      var arrayContains = function(a, obj) {
          var i = a.length;
          while (i--) {
             if (a[i] === obj) {
                 return true;
             }
          }
          return false;
      }; //http://stackoverflow.com/questions/237104/array-containsobj-in-javascript

      if (modifyNode == undefined || nodeIsModified == undefined) throw "You gotta give me defined params"



      var docObserver = new WebKitMutationObserver(function(mutations) {
            
            mutations.forEach(function(mutation) {

                //mutation type: characterData
                if (!!mutation.target.parentNode &&
                    !!mutation.target.parentNode.className &&
                    arrayContains(
                      mutation.target.parentNode.className.split(" "), 
                      desiredClass
                    )) {
                        if (!nodeIsModified($(mutation.target.parentNode))) {
                            console.log("update: " + mutation.target.data);

                            modifyNode($(mutation.target.parentNode));
                        }
                } 
                
                //mutation type: childList
                else if (mutation.addedNodes.length >= 1) {
                    var nodes = Array.prototype.slice.call(mutation.addedNodes,0);
                    nodes.forEach(function(addedNode) {
                        //handle the node itself
                        if (addedNode.classList && addedNode.classList.contains(desiredClass)) {
                            console.log("insert: " + addedNode.innerHTML); 
                            console.log("NOT IMPLEMENTED")
                            addedNode.innerHTML = modifyText(addedNode.innerHTML);
                        }
                        //handle the node's parent????
                        else if (addedNode.parentNode && addedNode.parentNode.classList && addedNode.parentNode.classList.contains(desiredClass)) {
                          if (!nodeIsModified($(addedNode.parentNode)))
                            console.log("NOT POSSIBLE???: parent has desired class!")
                        }

                        //handle the node's descendents
                        else $(addedNode).find('.' + desiredClass).each(function() {//.css( "background-color", "red" );
                            console.log("insert child: " + $(this).html())
                            $(this).html(modifyNode($(this)))
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
      return (str + " `"); //¤
  };
  observer.textHasChanged = function(str) {
      //return (str.indexOf("¤") == 0);
      return (!str || str.slice(-2) == " `");
  };
  observer.modifyNode = function(node) {
    /* function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }
    node.css("background-color", getRandomColor()); */

    node.text(node.text() + " `")
  }
  observer.nodeIsModified = function(node) {
    ismodified = (node.text().slice(-2) == " `")
    return ismodified;
  }

  // observeChanges("c", changeText, textHasChanged);
// eval('eval(\"eval(\\\"alert(\\\\\\\"Now I\\\\\\\\\\\\\\\'m confused!\\\\\\\")\\\")\")');


