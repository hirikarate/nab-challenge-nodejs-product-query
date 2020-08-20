module.exports = {
	"babelrcRoots": [
		".",
		// Keep Babel going on. By default, Babel stops when encountering package.json in subdirectories.
		"./*"
	],
	"presets": [
		["@babel/preset-env", {
			"targets": {
				"node": "current"
			}
		}]
	],
	"plugins": [
		"@babel/plugin-proposal-nullish-coalescing-operator",
		"@babel/plugin-proposal-optional-chaining",
		["@babel/plugin-proposal-private-property-in-object", {"loose": true }],
		["@babel/plugin-proposal-class-properties", {"loose": true }],
		["@babel/plugin-proposal-private-methods", {"loose": true }],
		["module-resolver", {
			"alias": {
				"~src": "./src",
				"~shared": "./src/_shared",
				"~shared-test": "./test/_shared",
				"joi": "joi/dist/joi-browser.min",
			}
		}]
	]
};
