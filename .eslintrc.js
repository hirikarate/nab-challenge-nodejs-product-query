module.exports = {
	env: {
		node: true,
		commonjs: true,
		es6: true,
		mocha: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
	},
	plugins: [
		'@typescript-eslint',
	],
	extends: [
		'airbnb-typescript/base',
	],
	rules: {
		'@typescript-eslint/brace-style': [
			'error',
			'stroustrup',
			{ allowSingleLine: true },
		],
		'@typescript-eslint/dot-notation': 0,
		'@typescript-eslint/indent': ['error', 'tab'],
		'@typescript-eslint/lines-between-class-members': 0,
		'@typescript-eslint/method-signature-style': 'error',
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: {
					delimiter: 'comma',
					requireLast: true,
				},
				singleline: {
					delimiter: 'comma',
					requireLast: false,
				},
				overrides: {
					interface: {
						multiline: {
							delimiter: 'none',
						},
					},
				},
			},
		],
		'@typescript-eslint/no-floating-promises': 'error',
		'@typescript-eslint/no-misused-new': 'error',
		'@typescript-eslint/no-throw-literal': 0,
		'@typescript-eslint/no-use-before-define': 0,
		'@typescript-eslint/no-unused-expressions': 0,
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				args: 'after-used',
				ignoreRestSiblings: true,
				varsIgnorePattern: "^_",
				argsIgnorePattern: "^_",
			},
		],
		'@typescript-eslint/prefer-function-type': 'error',
		'@typescript-eslint/require-await': 'error',
		'@typescript-eslint/restrict-plus-operands': 'error',
		"@typescript-eslint/semi": [
			"error",
			"never"
		],
		'@typescript-eslint/type-annotation-spacing': 'error',
		'@typescript-eslint/unified-signatures': 'error',

		// Reference: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
		'@typescript-eslint/naming-convention': [
			'error',
			// Allow camelCase variables (23.2), PascalCase variables (23.8), and UPPER_CASE variables (23.10)
			{
				selector: 'variable',
				format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
			},
			// Allow camelCase functions (23.2), and PascalCase functions (23.8)
			{ selector: 'function', format: ['camelCase', 'PascalCase'] },
			// Airbnb recommends PascalCase for classes (23.3), and although Airbnb does not make TypeScript recommendations, we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
			{ selector: 'typeLike', format: ['PascalCase'] },
			// Private members are prefixed with an underscore
			{
				selector: 'memberLike',
				modifiers: ['private'],
				format: ['camelCase'],
				leadingUnderscore: 'require',
			},
			// Type parameters (generics) are prefixed with T
			{ selector: 'typeParameter', format: ['PascalCase'], prefix: ['T'] },
			// Interface names begin with an I
			{ selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
		],
		'arrow-parens': 0,
		'arrow-body-style': 'warn',
		'class-methods-use-this': 0,
		'eol-last': 0,
		'function-paren-newline': 0,
		'func-names': 0,
		'implicit-arrow-linebreak': 0,
		'linebreak-style': 0,
		'max-len': ['error', 120],
		'max-classes-per-file': 0,
		'newline-per-chained-call': 0,
		'no-console': ['warn', { allow: ['error', 'warn'] }],
		'no-debugger': 'warn',
		'no-multiple-empty-lines': 0,
		'no-multi-assign': 0,
		'no-nested-ternary': 0,
		'no-restricted-syntax': 0,
		'no-param-reassign': ['error', { props: false }],
		'no-plusplus': 0,
		'no-tabs': 0,
		'no-underscore-dangle': 0,
		'no-void': 0,
		'padded-blocks': 0,
		'prefer-template': 0,
		'prefer-destructuring': 0,
		'import/prefer-default-export': 0,
		'import/first': 0,
		'import/order': 0,
	},
};