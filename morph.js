(function(window, document) {
var _ = {

	extend: function(src, dest) {
		for (var key in dest) {
			src[key] = dest[key];
		}
		return src;
	},

	contains: function(list, el) {
		for (var key in list) {
			if (list[key] === el) return true;
		}
		return false;
	},

	query: function(selector, el) {
		if (typeof selector != 'string') return null;
		el = el || document;
		return el.querySelector(selector);
	},

	vendorPropName: function(name) {
		var style = document.createElement('div').style;
		if (name in style) return name;

		var camel = _.camel('-' + name);
		var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
		for (var i = 0; i < prefixes.length; i++) {
			name = prefixes[i] + camel;
			if (name in style) return name;
		}
	},

	has3d: function() {
		var style = document.createElement('div').style;
		var transform = _.vendorPropName('transform');
		style[transform] = '';
		style[transform] = 'rotateY(90deg)';
		return style[transform] !== '';
	},

	camel: function(str) {
		return str.replace(/-(\w)/g, function(match, c) {
			return c.toUpperCase();
		});
	},

	uncamel: function(str) {
		return str.replace(/([A-Z])/g, function(letter) {
			return '-' + letter.toLowerCase();
		});
	},

	addUnit: function(v) {
		return typeof v == 'string' ? v : v + 'px';
	},

	getUnit: function(v) {
		return typeof v == 'string' ? v.replace(/[\d\.]/g, '') : 'px';
	},

	lerp: function(ratio, start, end) {
		return start + (end - start) * ratio;
	}
};

/** @license
 * Morph
 *
 * Author: Wesley Luyten
 * Version: 1.0.0 - (2013/02/06)
 */

Morph.defaults = {
	duration: 500
};

Morph.support = {
	transition: _.vendorPropName('transition'),
	transform: _.vendorPropName('transform'),
	transform3d: _.has3d()
};

function Morph(el) {
	if (!(this instanceof Morph)) return new Morph(el);
	this.el = _.query(el) || el;

	if (Morph.support.transition) {
		this.engine = new V8(this.el);
	} else {
		this.engine = new V6(this.el);
	}
	this.duration(Morph.defaults.duration);
}

Morph.prototype.duration = function(dur) {
	this.engine.duration(dur);
	return this;
};

Morph.prototype.css = function(prop, val) {
	this.engine.css(prop, val);
	return this;
};

Morph.prototype.to = function(prop, val) {
	this.engine.to(prop, val);
	return this;
};

Morph.prototype.start = function() {
	this.engine.start();
	return this;
};

window.Morph = Morph;


V6.aliases = {
	x: 'left',
	y: 'top'
};

function V6(el) {
	this.el = el;
	this._start = {};
	this._end = {};
}

V6.prototype.duration = function(dur) {
	this._duration = dur;
};

V6.prototype.css = function(obj, val) {
	_.extend(this._start, this.add(obj, val));
	this.setProperties();
};

V6.prototype.to = function(obj, val) {
	_.extend(this._end, this.add(obj, val));
};

V6.prototype.add = function(obj, val) {
	var map = {};
	if (val) map[obj] = val;
	else _.extend(map, obj);
	for (var alias in V6.aliases) {
		if (map[alias]) {
			map[V6.aliases[alias]] = map[alias];
			delete map[alias];
		}
	}
	return map;
};

V6.prototype.setProperties = function() {
	for (var prop in this._start) {
		this.el.style[_.camel(prop)] = _.addUnit(this._start[prop]);
	}
};

V6.prototype.initProperties = function() {
	for (var prop in this._end) {
		if (!this._start[prop]) {
			this._start[prop] = this.el.style[_.camel(prop)] || 1;
		}
	}
};

V6.prototype.applyProperties = function(ratio) {
	for (var prop in this._end) {
		var start = this._start[prop];
		var end = this._end[prop];
		var calc = _.lerp(ratio, parseFloat(start), parseFloat(end));
		this.el.style[_.camel(prop)] = calc + _.getUnit(end);
	}
};

V6.prototype.start = function() {
	this.stop();
	this.initProperties();

	var _this = this;
	var ratio = 0;
	var last = +new Date();
	var tick = function() {
		ratio += (new Date() - last) / _this._duration;
		ratio = ratio > 1 ? 1 : ratio;
		last = +new Date();
		_this.applyProperties(ratio);
		if (ratio === 1) _this.stop();
	};
	this.id = setInterval(tick, 16);
};

V6.prototype.stop = function() {
	clearInterval(this.id);
	this.reset();
};

V6.prototype.reset = function() {
	this._start = {};
};


V8.translate = _.has3d ? ['translate3d(',', 0)'] : ['translate(',')'];

V8.aliases = {
	x: function(v) { return ['#tx', V8.translate.join(v + ', 0')]; },
	y: function(v) { return ['#ty', V8.translate.join('0, ' + v)]; }
};

function V8(el) {
	this.el = el;
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
	if (val) map[obj] = val;
	else _.extend(map, obj);
	for (var alias in V8.aliases) {
		if (map[alias]) {
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
	var forceRepaint = this.el.offsetHeight;
};

V8.prototype.start = function() {

	if (this._transforms.length) {
		this.setVendorProperty('transform', this._transforms.join(' '));
		this.transition(_.uncamel(Morph.support.transform));
	}
	if (this._duration > 0) {
		this.setVendorProperty('transition-duration', this._duration + 'ms');
		this.setVendorProperty('transition-property', this._transitionProps.join(', '));
	}
	this.applyProperties(this._props);
	this.reset();
};
})(window, document);