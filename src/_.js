
var divstyle = document.createElement('div').style;

var _ = {

	extend: function(src, dest) {
		for (var key in dest) {
			src[key] = dest[key];
		}
		return src;
	},

	bind: function(fn, context) {
		return function() { fn.apply(context, [].slice.call(arguments)); };
	},

	style: function(el, prop) {
		if (window.getComputedStyle) {
			return getComputedStyle(el).getPropertyValue(_.uncamel(prop));
		} else if (el.currentStyle) {
			return el.currentStyle[_.camel(prop)];
		} else return el.style[_.camel(prop)];
	},

	matrix: function(str) {
		var arr = str.match(/\(([-\d., ]+?)\)/)[1].split(', ');
		if (arr.length == 6) {
			return { x: arr[4], y: arr[5] };
		} else if (arr.length == 16) {
			return { x: arr[12], y: arr[13] };
		}
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
		if (name in divstyle) return name;

		var camel = _.camel('-' + name);
		var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
		for (var i = 0; i < prefixes.length; i++) {
			name = prefixes[i] + camel;
			if (name in divstyle) return name;
		}
	},

	has3d: function() {
		var transform = _.vendorPropName('transform');
		divstyle[transform] = '';
		divstyle[transform] = 'rotateY(90deg)';
		return divstyle[transform] !== '';
	},

	on: function(el, type, fn) {
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.attachEvent) {
				el.attachEvent('on' + arr[i], fn);
			} else {
				el.addEventListener(arr[i], fn, false);
			}
		}
	},

	off: function(el, type, fn) {
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.detachEvent) {
				el.detachEvent('on' + arr[i], fn);
			} else {
				el.removeEventListener(arr[i], fn, false);
			}
		}
	},

	camel: function(str) {
		return (''+str).replace(/-(\w)/g, function(match, c) {
			return c.toUpperCase();
		});
	},

	uncamel: function(str) {
		return (''+str).replace(/([A-Z])/g, '-$1').toLowerCase();
	},

	addUnit: function(v) {
		return typeof v == 'string' ? v : v + 'px';
	},

	getUnit: function(v) {
		return typeof v == 'string' ? v.replace(/[-\d\.]/g, '') : 'px';
	},

	num: function(n) {
		return +(''+n).replace(/[^-\d.]/g, '');
	},

	lerp: function(ratio, start, end) {
		return start + (end - start) * ratio;
	}
};
