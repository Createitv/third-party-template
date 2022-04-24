module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "comma-dangle": 0, // 尾巴逗号
    "space-before-function-paren": 0, // 函数前的空格
    "no-multiple-empty-lines": [0, { max: 100 }], //空行最多不能超过100行
    "no-unused-vars": "off", //声明未使用
    "no-trailing-spaces": ["error", { skipBlankLines: true }], //允许在空行使用空白符
  },
};
