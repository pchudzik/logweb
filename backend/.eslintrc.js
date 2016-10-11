module.exports = {
	"extends": "airbnb",
	"plugins": [
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
		"comma-dangle": ["error", "never"],
		"quotes": ["error", "double"],
		"indent": ["error", "tab"],
		"import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
		"no-use-before-define": ["error", {"functions": false}]
	}
};
