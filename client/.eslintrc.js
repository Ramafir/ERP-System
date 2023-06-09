module.exports = {
    extends: ['eslint:recommended', 'plugin:vue/recommended'],
    rules: {
        'no-unused-vars': [
            'error',
            { vars: 'all', args: 'after-used', ignoreRestSiblings: true }
        ],
        'no-console': 'off',
        'vue/html-indent': ['error', 4, { baseIndent: 1 }],
        'vue/script-indent': ['error', 4, { baseIndent: 0, switchCase: 1 }],
        'vue/max-attributes-per-line': ['off'],
        'vue/html-self-closing': ['off'],
        'vue/no-v-html': ['off'],
        'vue/order-in-components': 2
    },
    parserOptions: {
        sourceType: 'module'
    },
    overrides: [
        {
            files: ['src/**/*'],
            parserOptions: {
                parser: '@babel/eslint-parser',
                sourceType: 'module'
            },
            env: {
                browser: true
            }
        }
    ],
    globals: {
        $: true,
        require: true,
        process: true,
        module: true
    }
};
