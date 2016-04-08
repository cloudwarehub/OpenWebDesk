define(function() {
	/**
	 * Create a new custom DOM element
	 * 
	 * @param String
	 *            tagName Tag Name
	 * @param Object
	 *            params Dict with data-* properties
	 * @param Array
	 *            ignoreParams (optional) list of arguments to ignore
	 * 
	 * @return DOMElement
	 */
	function createElement(tagName, params, ignoreParams) {
		ignoreParams = ignoreParams || [];

		var el = document.createElement(tagName);

		var classMap = {
			textalign: function(v) {
				Utils.$addClass(el, 'gui-align-' + v);
			},
			className: function(v) {
				Utils.$addClass(el, v);
			}
		};

		function getValue(k, value) {
			if (typeof value === 'boolean') {
				value = value ? 'true' : 'false';
			} else if (typeof value === 'object') {
				try {
					value = JSON.stringify(value);
				} catch (e) {
				}
			}

			return value;
		}

		if (typeof params === 'object') {
			Object.keys(params).forEach(function(k) {
				if (ignoreParams.indexOf(k) >= 0) {
					return;
				}

				var value = params[k];
				if (typeof value !== 'undefined' && typeof value !== 'function') {
					if (classMap[k]) {
						classMap[k](value);
						return;
					}

					var fvalue = getValue(k, value);
					el.setAttribute('data-' + k, fvalue);
				}
			});
		}

		return el;
	}
	return {
		createElement: createElement
	}
})