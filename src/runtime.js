// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.SVGame = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.SVGame.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		this.paper = Raphael(0, 0, this.runtime.width, this.runtime.height);
		this.elements = [];

		// Unfinished window resize event
		/*
		window.paper = this.paper;
		window.onresize = function() {
			console.log(window.paper)			
			console.log(window.innerWidth)
			console.log(window.innerHeight)
			window.paper.setSize(window.innerWidth, window.innerHeight);
		};
		*/
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};

	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cndsProto = pluginProto.cnds;

	// the example condition
	cndsProto.PickByID = function(id)
	{
		this.elements.forEach(function(element) {
			if (element.id === id) {
				element.picked = true;
			}
		});

		return hasPicked(this.elements);
	};
	
	// ... other conditions here ...
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var actsProto = pluginProto.acts;

	// the example action
	actsProto.CreateCircle = function(x, y, radius, id)
	{
		var circle = this.paper.circle(x, y, radius);
		circle.id = id;
		circle.picked = false;

		this.elements.push(circle);

		// Non-strict mode
		/*
		eval("circle" + id + " = " + this.paper.circle(x, y, radius));
		eval("circle" + id + ".id = " + id);
		*/
	};

	actsProto.CreateEllipse = function(x, y, rx, ry, id)
	{
		var ellipse = this.paper.ellipse(x, y, rx, ry);
		ellipse.id = id;
		ellipse.picked = false;

		this.elements.push(ellipse);
	};

	actsProto.CreateImage = function(src, x, y, width, height, id)
	{
		var image = this.paper.image(src, x, y, width, height);
		image.id = id;
		image.picked = false;

		this.elements.push(image);
	};

	actsProto.CreateRectangle = function(x, y, width, height, radius, id)
	{
		var rect = this.paper.rect(x, y, width, height, radius);
		rect.id = id;
		rect.picked = false;

		this.elements.push(rect);
	};

	actsProto.CreateText = function(x, y, string, id)
	{
		var text = this.paper.text(x, y, string);
		text.id = id;
		text.picked = false;

		this.elements.push(text);
	};

	actsProto.SetElementVisible = function(state)
	{		
		if (hasPicked(this.elements)) {
			this.elements.forEach(function(element) {
				if (element.picked === true) {
					element = (state === "Visible") ? element.show() : element.hide();
				};
			});
			clearPicked(this.elements);
		} else {
			this.elements.forEach(function(element) {
				element = (state === "Visible") ? element.show() : element.hide();
			});
		};
	};

	actsProto.RemoveElement = function()
	{		
		if (hasPicked(this.elements)) {
			/*
			this.pickedElements.forEach(function(pickedElement) {
				//pickedElement.remove();
				
				this.elements.forEach(function(element, index) {
					if (element.name === pickedElement.name) {
						element.remove();
						this.elements.splice(index, 1);
					};
				})
				
			});
			*/
			this.elements = this.elements.filter(function(element) {
				if (element.picked) {
					element.remove();					
				} else {
					return true;
				}
			})
			clearPicked(this.elements);
		} else {
			this.elements.forEach(function(element) {
				element.remove();
			});
			this.elements = [];
		};
	};
	
	// ... other actions here ...
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	Exps.prototype.MyExpression = function(ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();	

	function hasPicked(elements) {
		return elements.some(function(element) {
			return element.picked;
		});
	}

	function clearPicked(elements) {
		return elements.forEach(function(element) {
			element.picked = false;
		});
	}

}());