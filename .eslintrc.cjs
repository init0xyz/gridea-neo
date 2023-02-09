/*
 * @Date: 2023-02-09 11:53:34
 * @LastEditors: init0xyz laiyilong0@gmail.com
 * @LastEditTime: 2023-02-09 12:13:42
 * @FilePath: /gridea-neo/.eslintrc.cjs
 */
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: ['@antfu', 'prettier'],
  rules: {
    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'ignore',
        multiline: 'beside'
      }
    ],
    'antfu/if-newline': 'off'
  }
}
