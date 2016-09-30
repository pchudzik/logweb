module.exports = {
	"extends": "airbnb",
	"plugins": [
		"react",
		"jsx-a11y",
		"import"
	],
	"env": {
		"browser": "true",
		"mocha": "true"
	},
	"rules": {
		"no-tabs": "off",
		"react/jsx-indent": "off",

		"quotes": ["error", "double"],
		"indent": ["error", "tab"],
		"comma-dangle": ["error", "never"],

		"import/no-extraneous-dependencies": ["error", {"devDependencies": true}]
	}
};
