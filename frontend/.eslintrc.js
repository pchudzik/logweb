module.exports = {
	extends: "../shared.eslintrc.js",
	plugins: [
		"react",
		"jsx-a11y"
	],
	env: {
		browser: "true"
	},
	rules: {
		"react/jsx-indent": "off",
		"react/jsx-space-before-closing": "off",
		"react/jsx-indent-props": "off",

		"react/jsx-closing-bracket-location": ["error", "after-props"],
		"react/no-unused-prop-types": ["error", {"skipShapeProps": true}],
	}
};
