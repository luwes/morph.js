
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
