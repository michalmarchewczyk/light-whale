module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['svelte3', '@typescript-eslint'],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		indent: ['warn', 'tab'],
		quotes: ['warn', 'single'],
		semi: ['warn', 'always'],
		'@typescript-eslint/no-explicit-any': 2,
		'@typescript-eslint/consistent-type-imports': 2,
		'@typescript-eslint/no-empty-function': ['error', { allow: ['constructors'] }],
		'no-console': 1,
		'no-inline-comments': 1,
		'max-lines': [1, 120]
	}
};
