module.exports = {
	extends: "airbnb",
	plugins: ["import"],
	env: {
		"mocha": true
	},
	rules: {
		"no-tabs": "off",
		"no-use-before-define": ["error", {"functions": false}],
		"indent": ["error", "tab", {"SwitchCase": 1}],
		"quotes": ["error", "double"],
		"comma-dangle": ["error", "never"],
		"arrow-parens": ["error", "as-needed"],
		"object-curly-spacing": ["error", "never"],
		"prefer-template": "off",
		"consistent-return": "off",
		"no-underscore-dangle": "off",
		"class-methods-use-this": "off",

		"import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
	}
};
