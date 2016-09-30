module.exports = {
	"extends": "airbnb",
	"plugins": [
		"react",
		"jsx-a11y",
		"import"
	],
	"env": {
		"node": true,
		"mocha": true
	},
	"rules": {
		"no-tabs": "off",
		"class-methods-use-this": "off",
		"no-console": "off",
		"quotes": ["error", "double"],
		"indent": ["error", "tab"],
		"import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
		"no-use-before-define": ["error", {"functions": false}]
	}
};
