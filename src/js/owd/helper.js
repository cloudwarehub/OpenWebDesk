define(['urljoin'], function(_urljoin) {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}

	// Joins path segments. Preserves initial "/" and resolves ".." and "."
	// Does not support using ".." to go above/outside the root.
	// This means that join("foo", "../../bar") will not resolve to "../bar"
	function join(/* path segments */) {
		// Split the inputs into a list of path commands.
		var parts = [];
		for (var i = 0, l = arguments.length; i < l; i++) {
			parts = parts.concat(arguments[i].split("/"));
		}
		// Interpret the path commands to get the new resolved path.
		var newParts = [];
		for (i = 0, l = parts.length; i < l; i++) {
			var part = parts[i];
			// Remove leading and trailing slashes
			// Also remove "." segments
			if (!part || part === ".")
				continue;
			// Interpret ".." to pop the last segment
			if (part === "..")
				newParts.pop();
			// Push new path segments.
			else
				newParts.push(part);
		}
		// Preserve the initial slash if there was one.
		if (parts[0] === "")
			newParts.unshift("");
		// Turn back into a single string path.
		return newParts.join("/") || (newParts.length ? "/" : ".");
	}

	// A simple function to get the dirname of a path
	// Trailing slashes are ignored. Leading slash is preserved.
	function dirname(path) {
		return join(path, "..");
	}
	

	/**
	 * replace {{var}} with object value
	 */
	function render(template, data) {
		return template.replace(/\{{([a-zA-Z0-9_]+)\}}/g, function(t, c) {
			return eval("data." + c + "|| ''");
		});
	}

	return {
		uuid: function() {
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		},
		join: _urljoin,
		dirname: dirname,
		render: render
	}
})