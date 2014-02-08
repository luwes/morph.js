
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
