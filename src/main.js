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
