
/**
 * @require OpenLayers/Handler/Point.js
 * @require OpenLayers/Handler/Path.js
 * @require OpenLayers/Handler/Polygon.js
 */

/** api: (define)
 *  module = gxp
 *  class = AttributeFilterPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: AttributeFilterPanel(config)
 *   
 *      Create a panel for assembling radius filters.
 */
gxp.AttributeFilterPanel = Ext.extend(Ext.Panel, {
	
	// custom options
	config: {
		attributes: null
	},

	attributes: null,
	
	// This panel should not have a border by default.
	border: false,
	
	/** private: method[initComponent]
	 */
	initComponent: function() {	
		// Get the map object
		var map = this.target.mapPanel.map;

		// set date attribute and thow error if undefined
		if(this.config.attributes) {
			this.attributes = this.config.attributes;
		} else {
			throw new Error("You must set the attributes option within AttributeFilterPanel.config.");
		}

		// Set up the UI elements for this filter panel.
		// Use composite fields to align and place in seperate rows.
		this.items = [];
		for(var i=0; i<this.attributes.length; i++) {
			this.items.push(
				// composite field for start date
				{
					xtype: "compositefield",
					//width: 400,
					items: [
						// Label for attribute
						{
							xtype: "label",
							text: this.attributes[i].label + ":",
							style: "padding-left: 5px; padding-top: 0.3em; width: 75px; text-alight: right"
						},
						// Date input field for the start date value
						{
							xtype: "textfield",
							name: this.attributes[i].name,
							ref: "../" + this.attributes[i].name,
							fieldLabel: this.attributes[i].name
							//allowBlank: false
						}
				
					]
				}
			);
		}

		this.on({
			// When this panel is destroyed, we need to make sure the "add point" control and
			// the selection layer are removed from the map.
			beforedestroy: function() {
				//this.control.deactivate();
				//map.removeControl(this.control);
				//this.dropPointButton.disable();
				//map.removeLayer(this.bufferPointLayer);
			},
			// Need to deactivate the draw control when the fieldset is collapsed or the query box
			// is closed. Will need to find the appropriate event. Might need to set event handler
			// on parent object(s).
			// beforehide doesn't work
			beforehide: function() {
				//this.control.deactivate();
				//this.dropPointButton.toggle(false);
			},
			scope: this
		});
	
		// Make sure to call the superclass's method.
		gxp.AttributeFilterPanel.superclass.initComponent.call(this);
	},

	hideParent: function(me) {
	
	},

	/** api: method[getFilters]
	 *  :return: ``Array`` of ``OpenLayers.Filter``
	 *  
	 *  Returns a filter that fits the model in the Filter Encoding
	 *  specification.  Use this method instead of directly accessing
	 *  the ``filter`` property.  Return will be ``false`` if any child
	 *  filter does not have a type, property, or value.
	 */
	getFilters: function() {
		var filters = [];

		var value;
		for(var i=0; i<this.attributes.length; i++) {
			value = this[this.attributes[i].name].getValue();
			if(value) {
				filters.push(new OpenLayers.Filter.Comparison(
					{
						type: OpenLayers.Filter.Comparison.LIKE,
						property: this.attributes[i].name,
						value: "%" + this[this.attributes[i].name].getValue() + "%",
						matchCase: false
					}
				));
			}
		}

		return filters;
	},
});

/** api: xtype = gxp_attributefilterpanel */
Ext.reg('gxp_attributefilterpanel', gxp.AttributeFilterPanel); 
