(function() {
    
    var tree;
    var nodes = [];
    var nodeIndex;
    
    function treeInit() {
	YAHOO.log("Initializing TaskNode TreeView instance.")
	buildTaskNodeTree();
    }
    
    //handler for expanding all nodes
    YAHOO.util.Event.on("expand", "click", function(e) {
	YAHOO.log("Expanding all TreeView  nodes.", "info", "example");
	tree.expandAll();
	YAHOO.util.Event.preventDefault(e);
    });
    
    //handler for collapsing all nodes
    YAHOO.util.Event.on("collapse", "click", function(e) {
	YAHOO.log("Collapsing all TreeView  nodes.", "info", "example");
	tree.collapseAll();
	YAHOO.util.Event.preventDefault(e);
    });

    //handler for checking all nodes
    YAHOO.util.Event.on("check", "click", function(e) {
	YAHOO.log("Checking all TreeView  nodes.", "info", "example");
	checkAll();
	YAHOO.util.Event.preventDefault(e);
    });
    
    //handler for unchecking all nodes
    YAHOO.util.Event.on("uncheck", "click", function(e) {
	YAHOO.log("Unchecking all TreeView  nodes.", "info", "example");
	uncheckAll();
	YAHOO.util.Event.preventDefault(e);
    });


    YAHOO.util.Event.on("getchecked", "click", function(e) {
	YAHOO.log("Checked nodes: " + YAHOO.lang.dump(getCheckedNodes()), "info", "example");
        
	YAHOO.util.Event.preventDefault(e);
    });

    //Function  creates the tree and 
    //builds between 3 and 7 children of the root node:
    function buildTaskNodeTree() {
	if ( ! gridNodes )
            throw "no gridNodes";

	//instantiate the tree:
        tree = new YAHOO.widget.TreeView("treeDiv1");
        
        for ( var location in gridNodes ){
            var locNode = new YAHOO.widget.TaskNode( location , tree.getRoot() , false );
            
            for ( var provider in gridNodes[location] ){
                var providerNode = new YAHOO.widget.TaskNode( provider , locNode , false );

                for ( var num in gridNodes[location][provider] ){
                    new YAHOO.widget.TaskNode( location + "-" + provider + "-n" + num , providerNode , false );
                }
            }

        }

        // Expand and collapse happen prior to the actual expand/collapse,
        // and can be used to cancel the operation
        tree.subscribe("expand", function(node) {
            YAHOO.log(node.index + " was expanded", "info", "example");
            // return false; // return false to cancel the expand
        });

        tree.subscribe("collapse", function(node) {
            YAHOO.log(node.index + " was collapsed", "info", "example");
        });

        // Trees with TextNodes will fire an event for when the label is clicked:
        tree.subscribe("labelClick", function(node) {
            YAHOO.log(node.index + " label was clicked", "info", "example");
        });

        // Trees with TaskNodes will fire an event for when a check box is clicked
        tree.subscribe("checkClick", function(node) {
            YAHOO.log(node.index + " check was clicked", "info", "example");
        });

        tree.subscribe("clickEvent", function(node) {
            YAHOO.log(node.index + " clickEvent", "info", "example");
        });

	//The tree is not created in the DOM until this method is called:
        tree.draw();
    }

    var callback = null;

    function onCheckClick(node) {
        YAHOO.log(node.label + " check was clicked, new state: " + 
                  node.checkState, "info", "example");
    }

    function checkAll() {
        var topNodes = tree.getRoot().children;
        for(var i=0; i<topNodes.length; ++i) {
            topNodes[i].check();
        }
    }

    function uncheckAll() {
        var topNodes = tree.getRoot().children;
        for(var i=0; i<topNodes.length; ++i) {
            topNodes[i].uncheck();
        }
    }

    // Gets the labels of all of the fully checked nodes
    // Could be updated to only return checked leaf nodes by evaluating
    // the children collection first.
    function getCheckedNodes(nodes) {
        nodes = nodes || tree.getRoot().children;
        checkedNodes = [];
        for(var i=0, l=nodes.length; i<l; i=i+1) {
            var n = nodes[i];
            //if (n.checkState > 0) { // if we were interested in the nodes that have some but not all children checked
            if (n.checkState === 2) {
                checkedNodes.push(n.label); // just using label for simplicity
            }

            if (n.hasChildren()) {
                checkedNodes = checkedNodes.concat(getCheckedNodes(n.children));
            }
        }

        return checkedNodes;
    }


    YAHOO.util.Event.onDOMReady(treeInit);
})();
