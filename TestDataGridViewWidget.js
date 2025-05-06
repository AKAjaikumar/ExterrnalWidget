require([
    'UWA/Core',
    'DS/DataGridView/DataGridView',
    'DS/TreeModel/TreeDocument',
    'DS/TreeModel/TreeNodeModel'
], function(UWA, DataGridView, TreeDocument, TreeNodeModel) {
    var myWidget = {
        onLoad: function() {

            var container = widget.body;
            container.innerHTML = '';
            if (!container) {
                console.error("Container #testGridView not found!");
                return;
            }

            var wrapper = UWA.createElement('div', {
                class: 'grid-wrapper',
                styles: {
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%' // Full height of the widget
                }
            });

            var toolbar = UWA.createElement('div', {
                class: 'toolbar',
                styles: {
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: '10px',
                    padding: '8px',
                    flex: 'none',
                    minHeight: '40px',
                    background: '#f8f8f8',
                    borderBottom: '1px solid #ddd',
                    position: 'relative', 
                    zIndex: 10 
                }
            });

            var addButton = UWA.createElement('button', {
                text: 'Add EIN',
                styles: {
                    padding: '6px 12px',
                    background: '#0073E6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                },
                events: {
                    click: function() {
                        var selectedNodes = doc.getSelectedNodes();

                        if (selectedNodes.length === 0) {
                            alert("No rows selected!");
                            return;
                        }

                        // Extract data from selected rows
                        var selectedData = selectedNodes.map(function(node) {
                            return {
                                name: node.getLabel(),
                                quantity: node.options.grid.quantity
                            };
                        });

                        // Do something with the selectedData
                        console.log("Selected EINs:", selectedData);


                        alert("Selected:\n" + selectedData.map(d => `Name --- ${d.name}: Qty ---- ${d.quantity}`).join("\n"));
                    }
                }
            });

            addButton.inject(toolbar);

            Object.assign(container.style, {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                flex: '1 1 auto',
                overflow: 'hidden'
            });

            var gridContainer = UWA.createElement('div', {
                id: 'gridContent',
                styles: {
                    flex: '1 1 auto',
                    overflow: 'auto',
                    height: '100%',
                    minHeight: '100px',
                    position: 'absolute',
                    top: '60px',
                    left: '0px',
                    bottom: '0px',
                    width: '100%',
                }
            });

            toolbar.inject(wrapper);
            gridContainer.inject(wrapper);
            wrapper.inject(container);
            var columns = [{
                    text: 'Name',
                    dataIndex: 'label',
                    isTree: true
                },
                {
                    text: 'Quantity',
                    dataIndex: 'quantity'
                }
            ];

            var doc = new TreeDocument({
                useAsyncPreExpand: false
            });

            var root = new TreeNodeModel({
                label: 'Assembly 1',
                expanded: true,
                grid: {
                    quantity: 1
                }
            });

            var child1 = new TreeNodeModel({
                label: 'Part A',
                grid: {
                    quantity: 2
                }
            });

            var child2 = new TreeNodeModel({
                label: 'Part B',
                grid: {
                    quantity: 3
                }
            });

            doc.addRoot(root);
            root.addChild(child1);
            root.addChild(child2);

            var gridView = new DataGridView({
                columns: columns,
                model: doc,
                treeDocument: doc,
                treeMode: true,
                selectable: true,
                multiSelect: true,
                showRoot: true,
                dragAndDrop: true,
                allowDropOnNodes: true,
                allowDropOnRoot: true
            });

          gridView.addEvent('drop', function (info, event) {
			  var dataTransfer = event.dataTransfer;
			  if (dataTransfer && dataTransfer.types.includes('text/plain')) {
				var droppedData = dataTransfer.getData('text/plain');
				var parsed = JSON.parse(droppedData);

				console.log("Dropped from search:", parsed);

				// You can create a new TreeNodeModel from this:
				var newNode = new TreeNodeModel({
				  label: parsed.label || parsed.name || 'Unknown',
				  grid: {
					quantity: 1
				  }
				});

				// Add to document
				if (info.targetNodeModel) {
				  info.targetNodeModel.addChild(newNode);
				} else {
				  doc.addRoot(newNode);
				}
			  }
		});

            gridView.inject(gridContainer);
            root.expand();

        }
    };

    widget.addEvent('onLoad', myWidget.onLoad);
});