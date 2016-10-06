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
		"prefer-template": "off",
		"consistent-return": "off",
		"no-underscore-dangle": "off",
		"react/jsx-indent": "off",
		"react/jsx-space-before-closing": "off",
		"react/jsx-indent-props": "off",

		"react/jsx-closing-bracket-location": ["error", "after-props"],
		"react/no-unused-prop-types": ["error", {"skipShapeProps": true}],

		"arrow-parens": ["error", "as-needed"],
		"object-curly-spacing": ["error", "never"],
		"quotes": ["error", "double"],
		"indent": ["error", "tab", {"SwitchCase": 1}],
		"comma-dangle": ["error", "never"],
		"no-use-before-define": ["error", {"functions": false}],

		"import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
	}
};
