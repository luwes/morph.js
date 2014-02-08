
V8.translate = _.has3d ? ['translate3d(',', 0)'] : ['translate(',')'];

V8.ends = [
	'transitionend',
	'webkitTransitionEnd',
	'oTransitionEnd',
	'MSTransitionEnd'
];

V8.aliases = {
	x: function(v) { return ['#tx', V8.translate.join(v + ', 0')]; },
	y: function(v) { return ['#ty', V8.translate.join('0, ' + v)]; }
};

function V8(main) {
	this.main = main;
	this.el = main.el;

	this._update = _.bind(this.update, this);
	this._end = _.bind(this.end, this);

	this.reset();
}

V8.prototype.reset = function() {
	this._props = {};
	this._transitionProps = [];
	this._transforms = [];
};

V8.prototype.duration = function(n) {
	this._duration = n;
};

V8.prototype.setVendorProperty = function(prop, val) {
	this.setProperty(_.uncamel(_.vendorPropName(prop)), val);
};

V8.prototype.setProperty = function(prop, val) {
	this._props[prop] = val;
};

V8.prototype.css = function(obj, val) {
	this.duration(0);
	this.to(obj, val);
	this.start();
	this.update();
};

V8.prototype.to = function(obj, val) {
	var adds = this.add(obj, val);
	for (var prop in adds) {
		if (prop.match(/^#/)) {
			this.transform(adds[prop]);
			delete adds[prop];
		} else {
			this.transition(prop);
		}
	}
	_.extend(this._props, adds);
};

V8.prototype.add = function(obj, val) {
	var map = {};
	if (val !== undefined) map[obj] = val;
	else _.extend(map, obj);
	for (var alias in V8.aliases) {
		if (map[alias] !== undefined) {
			var value = _.addUnit(map[alias]);
			var result = V8.aliases[alias](value);
			map[result[0]] = result[1];
			delete map[alias];
		}
	}
	return map;
};

V8.prototype.transition = function(prop) {
	if (!_.contains(this._transitionProps, prop)) {
		this._transitionProps.push(prop);
	}
};

V8.prototype.transform = function(transform) {
	if (!_.contains(this._transforms, transform)) {
		this._transforms.push(transform);
	}
};

V8.prototype.applyProperties = function(map) {
	for (var prop in map) {
		this.el.style.setProperty(prop, map[prop]);
	}
};

V8.prototype.start = function() {

	if (this._transforms.length) {
		this.setVendorProperty('transform', this._transforms.join(' '));
		this.transition(_.uncamel(Morph.support.transform));
	}
	if (this._duration > 0) {
		this.setVendorProperty('transition-duration', this._duration + 'ms');
		this.setVendorProperty('transition-property', this._transitionProps.join(', '));
		this.id = setInterval(this._update, 16);
		this.fired = false;
		_.on(this.el, V8.ends.join(' '), this._end);
	}
	this.applyProperties(this._props);
	this.reset();
};

V8.prototype.update = function() {
	this.main.events.update.fire();
};

V8.prototype.end = function() {
	_.off(this.el, V8.ends.join(' '), this._end);
	clearInterval(this.id);
	if (!this.fired) {
		this.fired = true;
		this.main.events.end.fire();
	}
};
