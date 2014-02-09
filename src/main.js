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
	this.events = {
		update: new Signal(),
		end: new Signal()
	};
	if (Morph.support.transition) {
		this.engine = new V8(this);
	} else {
		this.engine = new V6(this);
	}
	this.duration(Morph.defaults.duration);
}

Morph.prototype.duration = function(dur) {
	this.engine.duration(dur);
	return this;
};

Morph.prototype.get = function(prop) {
	return this.engine.get(prop);
};

Morph.prototype.set = function(obj, val) {
	this.engine.set(obj, val);
	return this;
};

Morph.prototype.to = function(prop, val) {
	this.engine.to(prop, val);
	return this;
};

Morph.prototype.ease = function(fn) {
	this.engine.ease(fn);
	return this;
};

Morph.prototype.start = function() {
	this.engine.start();
	return this;
};

Morph.prototype.on = function(event, fn) {
	this.events[event].on(fn);
	return this;
};

Morph.prototype.off = function(event, fn) {
	this.events[event].off(fn);
	return this;
};

window.Morph = Morph;
