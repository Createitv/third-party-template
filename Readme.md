# How to Write an Open Source JavaScript Library

## 为什么开发开源库？

代码复用、方便任何地方获取、分享到NPM给他人使用

# 开源npm包步骤

## 1.Gihub，NPM账户注册

## 2. 配置npm和package.json

-   安装Node合适版本
-   配置npm设置

```jsx
$ npm set init-author-name "yoursNaame"
$ npm set init-author-url "yoursWebsiteAddress"
$ npm set init-author-email "yoursEmailAddress@gmail.com"
$ npm set init-license "MIT"
```

-   验证你的npm配置

```bash
$ cat ~/.npmrc
```

-   注册Npm账户并将自己的终端添加Npm源
-   `$ npm add-user`, 输入账户密码，成功之后会添加auth token到**~/.npmrc 国内用户如果时淘宝镜像源需要nrm切换注册到npm官方镜像源才能完成注册。**
-   `$ npm init -y` 创建默认 `package.json`****

## 2.工程化规范：

### 2.1 编辑器代码规范.editorconfig

EditorConfig 有助于为不同 IDE 编辑器上处理同一项目的多个开发人员维护一致的编码风格。

```json
# <http://editorconfig.org>
root = true

[*] # 表示所有文件适用
    charset = utf-8 # 设置文件字符集为 utf-8
    indent_style = space # 缩进风格（tab | space）
    indent_size = 4 # 缩进大小
    end_of_line = lf # 控制换行类型(lf | cr | crlf)
    trim_trailing_whitespace = true # 去除行首的任意空白字符
    insert_final_newline = true # 始终在文件末尾插入一个新行

[*.md] # 表示仅 md 文件适用以下规则
    max_line_length = off
    trim_trailing_whitespace = false

[{*.cjs,*.js}]
	indent_size = 2
	max_line_length = 80
	tab_width = 2
```

### 2.2 代码风格格式化prettier工具

Prettier 是一款强大的代码格式化工具，支持 JavaScript、TypeScript、CSS、SCSS、Less、JSX、Angular、Vue、GraphQL、JSON、Markdown 等语言，基本上前端能用到的文件格式它都可以搞定，是当下最流行的代码格式化工具。

1.安装prettier

```bash
 npm install prettier -D
```

2.配置prettierrc.js文件：

-   useTabs：使用tab缩进还是空格缩进，选择false；
-   tabWidth：tab是空格的情况下，是几个空格，选择2个；
-   printWidth：当行字符的长度，推荐80，也有人喜欢100或者120；
-   singleQuote：使用单引号还是双引号，选择true，使用单引号；
-   trailingComma：在多行输入的尾逗号是否添加，设置为 `none`；
-   semi：语句末尾是否要加分号，默认值true，选择false表示不加；

```json
module.exports = {
  printWidth: 80, //单行长度
  tabWidth: 2, //缩进长度
  useTabs: false, //使用空格代替tab缩进
  semi: false, //句末使用分号
  singleQuote: true, //使用单引号
  quoteProps: "as-needed", //仅在必需时为对象的key添加引号
  jsxSingleQuote: true, // jsx中使用单引号
  trailingComma: "all", //多行时尽可能打印尾随逗号
  bracketSpacing: true, //在对象前后添加空格-eg: { foo: bar }
  jsxBracketSameLine: true, //多属性html标签的‘>’折行放置
  arrowParens: "always", //单参数箭头函数参数周围使用圆括号-eg: (x) => x
  requirePragma: false, //无需顶部注释即可格式化
  insertPragma: false, //在已被preitter格式化的文件顶部加上标注
  proseWrap: "preserve",
  htmlWhitespaceSensitivity: "ignore", //对HTML全局空白不敏感
  vueIndentScriptAndStyle: false, //不对vue中的script及style标签缩进
  endOfLine: "lf", //结束行形式
  embeddedLanguageFormatting: "auto", //对引用代码进行格式化
};
```

3.创建.prettierignore忽略文件，这些文件夹不会被格式化

```yaml
/dist/*
.local
.output.js
/node_modules/**

**/*.svg
**/*.sh

/public/*
```

### 2.3 代码风格检验工具eslint

安装插件并且需要兼容prettier

```bash
npm i eslint-plugin-prettier eslint-config-prettier -D
```

创建***\*eslintrc.js配置文件\****

```jsx
module.exports = {
  root: true,
  env: {
    node: true,
  },
  // "off" or 0 - 关闭规则
  // "warn" or 1 - 将规则视为一个警告
  // "error" or 2 - 将规则视为一个错误
  // allow async-await
  extends: ["plugin:vue/vue3-essential", "@vue/standard"],
  parserOptions: {
    parser: "babel-eslint",
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
```

### 2.4 Git提交规范git Hook

虽然我们已经要求项目使用eslint了，但是不能保证组员提交代码之前都将eslint中的问题解决掉了：

-   也就是我们希望保证代码仓库中的代码都是符合eslint规范的；
-   那么我们需要在组员执行 `git commit` 命令的时候对其进行校验，如果不符合eslint规范，那么自动通过规范进行修复；

那么如何做到这一点呢？可以通过Husky工具：

-   husky是一个git hook工具，可以帮助我们触发git提交的各个阶段：pre-commit、commit-msg、pre-push

如何使用husky呢？

这里我们可以使用自动配置命令：

```jsx
npx husky-init && npm install
```

这里会做三件事：

1.安装husky相关的依赖：

2.在项目目录下创建 `.husky` 文件夹：

```
npx huksy install
```

3.在package.json中添加一个脚本：

```json
  "scripts": {
    "prepare": "husky install"
  }
```

4.添加git hooks，运行一下命令创建git hooks

```
npx husky add .husky/pre-commit "npm run test"
```

运行完该命令后我们会看到.husky/目录下新增了一个名为pre-commit的shell脚本。也就是说在在执行git commit命令时会先执行pre-commit这个脚本。pre-commit脚本内容如下：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
   
npm run  test
```

可以看到该脚本的功能就是执行npm run test这个命令

### 2.5 Git commit提交规范和提交验证

通常我们的git commit会按照统一的风格来提交，这样可以快速定位每次提交的内容，方便之后对版本进行控制

![](https://typora-1300715298.cos.ap-shanghai.myqcloud.com/008i3skNgy1gsqw17gaqjj30to0cj3zp.jpg)

但是如果每次手动来编写这些是比较麻烦的事情，我们可以使用一个工具：Commitizen

* Commitizen 是一个帮助我们编写规范 commit message 的工具；

1.安装Commitizen

```shell
npm install commitizen -D
```

2.安装cz-conventional-changelog，并且初始化cz-conventional-changelog：

```shell
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

这个命令会帮助我们安装cz-conventional-changelog：

会在package.json中多出以下配置

```json
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
```

执行命令
`npm i cz-conventional-changelog-zh`

```
// 修改package.json配置
"config": {
    "commitizen": {
       "path": "./node_modules/cz-conventional-changelog-zh"
    }
  }
```

这个时候我们提交代码需要使用 `npx cz`：

![image-20220424155447983](https://typora-1300715298.cos.ap-shanghai.myqcloud.com/image-20220424155447983.png)



* 第一步是选择type，本次更新的类型

| Type     | 作用                                                         |
| -------- | ------------------------------------------------------------ |
| feat     | 新增特性 (feature)                                           |
| fix      | 修复 Bug(bug fix)                                            |
| docs     | 修改文档 (documentation)                                     |
| style    | 代码格式修改(white-space, formatting, missing semi colons, etc) |
| refactor | 代码重构(refactor)                                           |
| perf     | 改善性能(A code change that improves performance)            |
| test     | 测试(when adding missing tests)                              |
| build    | 变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等） |
| ci       | 更改持续集成软件的配置文件和 package 中的 scripts 命令，例如 scopes: Travis, Circle 等 |
| chore    | 变更构建流程或辅助工具(比如更改测试环境)                     |
| revert   | 代码回退                                                     |

#### 代码提交验证

如果我们按照cz来规范了提交风格，但是依然有同事通过 `git commit` 按照不规范的格式提交应该怎么办呢？

* 我们可以通过commitlint来限制提交；

1.安装 @commitlint/config-conventional 和 @commitlint/cli

```shell
npm i @commitlint/config-conventional @commitlint/cli -D
```

2.在根目录创建commitlint.config.js文件，配置commitlint

```js
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

3.使用husky生成commit-msg文件，验证提交信息：

```shell
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

### 2.6 Git提交忽略文件

直接从WebStorm中创建node版本的.gitignore文件.VsCode也有插件快速生成模板文件

### 2.7 RollUp、Babel打包配置

主要作用：

1.   该库是用 ES6+ 编写的，使用 import 和 export 关键字
2.   该库可以与 <script> 标签一起使用
3.   该库可用于使用现代捆绑器的 Web 应用程序。
4.   该库可以在Node中使用。

```bash
npm install rollup-plugin-babel --save-dev
```

配置文件是一个ES6模块，它对外暴露一个对象，这个对象包含了一些Rollup需要的一些选项。通常，我们把这个配置文件叫做`rollup.config.js`，它通常位于项目的根目录,下面是一些配置选项

```javascript
import babel from 'rollup-plugin-babel'

export default {
  input: './src/main',
  output: {
    file: './dist/bundle.js', // 输出文件
    format: 'cjs', // 五种输出格式：amd /  es6 / iife / umd / cjs
    name: 'bundleName',
    sourcemap:true  //生成bundle.map.js文件，方便调试
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external:['lodash'] //告诉rollup不要将此lodash打包，而作为外部依赖
}

```

为了正确解析我们的模块并使其与旧版浏览器兼容，我们应该包括babel来编译输出。许多开发人员在他们的项目中使用 Babel ，以便他们可以使用未被浏览器和 Node.js 支持的将来版本的 JavaScript 特性。

```bash
// 安装 rollup-plugin-babel
npm install rollup-plugin-babel --save-dev
npm install @babel/core @babel/preset-env --save-dev
```

添加Babel配置文件.babelrc。

```javascript
{
  "presets": [
    [
      "@babel/env",
      {
        "modules": false // 设置为false,否则babel会在rollup有机会执行其操作之前导致我们的模块转化为commonjs
      }
    ]
  ]
}
```

配置rollup.config.js

```javascript
import babel from 'rollup-plugin-babel'

export default {
  input: './src/main',
  output: {
    file: './dist/bundle.js',
    format: 'cjs',
    name: 'bundleName'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
```

### Node打包支持

-   rollup-plugin-node-resolve 插件允许我们加载第三方模块
-   @rollup/plugin-commons 插件将它们转换为ES6版本

```bash
npm install @rollup/plugin-node-resolve @rollup/plugin-commonjs --save-dev
```

配置rollup.config.js

```javascript
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-typescript'

export default {
  input: './src/main',
  output: {
    file: './dist/bundle.js',
    format: 'cjs',
    name: 'bundleName'
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: ['lodash']
}
```

### 压缩代码

安装rollup-plugin-terser插件

```bash
npm install rollup-plugin-terser --save-dev
```

配置rollup.config.js

```javascript
  plugins: [
    ...
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
    terser()
  ],

```

### 开启本地web服务,开启热更新

安装rollup-plugin-serve

```bash
npm install rollup-plugin-serve --save-dev
npm install rollup-plugin-livereload --save-dev
```

配置rollup.config.js

```javascript
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'

export default {
	input: './src/main',
	output: [
		{
			file: './dist/bundle.common.js',
			format: 'cjs',
			exports: 'named',
			sourcemap: true,
		},
		{
			dir: 'dist/bundle.esm.js',
			format: 'esm',
			exports: 'named',
			sourcemap: true,
		},
	],
	plugins: [
		resolve(),
		babel({
			exclude: 'node_modules/**',
		}),
		terser(),
		livereload(), // 热更新
		serve({
			open: true,
			contentBase: 'dist',
		}),
	],
	external: ['lodash'],
}

```

### 2.8 JSDOC文档配置

```bash
npm install -D jsdoc
```

配置jsdoc.json

```json
{
    "tags": {
        "allowUnknownTags": true
    },
    "source": {
        "include": ["./src", "lib", "package.json", "README.md"],
        "includePattern": ".+\\.js(doc|x)?$",
        "excludePattern": "(^|\\/|\\\\)_",
        "exclude": ["./src/index.js"]
    },
    "plugins": [],
    "opts": {
        "template": "./node_modules/clean-jsdoc-theme",
        "encoding": "utf8",
        "destination": "./doc/doc-page/",
        "recurse": true,
        "theme_opts": {
            "theme": "light"
        }
    },
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false,
        "default": {
            "outputSourceFiles": true
        }
    }
}
```

tags：控制那些标签允许被使用和解析
source：指定要用jsdoc生成文档的文件
include：路径组成的数组，jsdoc将为它们生成文档
exclude：路径组成的数组，jsdoc应忽略的路径
includePattern：正则表达式字符串，只有文件名匹配的文件才会被jsdoc扫描。默认为 .+.js(doc)?$ 即 .js 或 .jsdoc 结尾的文件才会被扫描
excludePattern：正则表达式字符串，文件名匹配的文件将被jsdoc忽略。默认为 (^|\\/|\\\\)_ 即下划线开头的文件或下划线开头的目录下的所有文件
结合起来，jsdoc的执行过程是：
扫描include中的所有文件（若使用了 -r 命令将在子目录中递归搜索）
在上一步搜索到的文件中，使用includePattern匹配文件名，只保留相匹配的文件
在上一步匹配到的文件中，使用excludePattern匹配文件名，剔除相匹配的文件
在上一部生于的文件中，如果文件路径在exclude中，该文件将被剔除
最终剩下的文件将通过jsdoc进行解析
opts：配置命令行选项，与上面讲的选项相对应
plugins：要启用的插件，在数组中添加插件相对于JSDoc文件夹的路径即可
templates：配置jsdoc所生成的文档的模板

### jsDoc风格选择

```bash
npm install clean-jsdoc-theme
```



配置package.json脚本

```json
 "generate-docs": "node_modules/.bin/jsdoc --configure .jsdoc.json --verbose"
```

在您的 `jsdoc.json`文件中，添加一个template选项。

```
"opts": {
  "template": "node_modules/clean-jsdoc-theme"
}
```

## 3.库编码和添加其他依赖包

-   创建主文件
-   安装所需的依赖项
-   使用 -S 或 --save 将其保存为 package.json 中的依赖项
-   使用 -D 或 --save-dev 将其保存为 package.json 中的 devDependency 创建功能
-   编辑库功能代码

## 4.推送到github并打标签

-   在项目的根目录下创建一个 .gitignore，列出所有被忽略的文件和目录
-   git add <file-name> 暂存更改或者 $ git add --all 暂存所有更改
-   git commit 提交更改
-   git push origin <repo-name> 将更改推送到 GitHub(origin)
-   git remote -v 将显示所有可用的遥控器及其对应的 url
-   git tag <version>给代码库打标签 git push —tag推送到github的标签栏

## 5.使用Mocha自动化测试

```bash
$ npm i -D mocha
// test.js
var expect = require('chai').expect;
var functionality = required('./path/to/index.js');

describe('functionality', function() {
  it('should validate the functionality', function() {
    expect(true).to.be.true;
  });
});
```

## 6.测试覆盖率

添加图标：https://shields.io/

## 7.Devops使用TravisCI自动化发布版本



## 

## 8. 其他

开源库希望得到用户的反馈，如果对用户提的issue有要求，可以设置一个模版，用来规范github上用户反馈的issue需要制定一些信息

通过提供`.github/ISSUE_TEMPLATE`文件可以给issue提供模版，下面是一个例子，用户提issue时会自动带上如下的提示信息

```bash
### 问题是什么
问题的具体描述，尽量详细

### 环境
- 手机: 小米6
- 系统：安卓7.1.1
- 浏览器：chrome 61
- 版本：0.2.0
- 其他版本信息

### 在线例子
如果有请提供在线例子

### 其他
其他信息
```

### [TODO.md](https://link.juejin.cn/?target=http%3A%2F%2FTODO.md)

TODO应该记录项目的未来计划，这对于贡献者和使用者都有很重要的意义，下面是TODO的例子

```bash
- [X] 已完成
- [ ] 未完成
```

### [CHANGELOG.md](https://link.juejin.cn/?target=http%3A%2F%2FCHANGELOG.md)

CHANGELOG记录项目的变更日志，对项目使用者非常重要，特别是在升级使用版本时，CHANGELOG需要记录项目的版本，发版时间和版本变更记录

```bash
## 0.1.0 / 2022-4-24

- 新增xxx功能
- 删除xxx功能
- 更改xxx功能
```

### LICENSE

开源项目必须要选择一个协议，因为没有协议的项目是没有人敢使用的，关于不同协议的区别可以看下面这张图（出自阮老师博客），我的建议是选择MIT或者BSD协议。



## 9. 参考

-   https://juejin.cn/post/6844903687819640845
-   https://gist.github.com/oncode/4c487be7964a291a363187e26627c5ce
-   https://www.qbenben.com/post/2022/02/27/cz-git/
-   [authoring-a-javascript-library-that-works-everywhere-using-rollup](https://adostes.medium.com/authoring-a-javascript-library-that-works-everywhere-using-rollup-f1b4b527b2a9)
-   [rollup详细使用教程](https://juejin.cn/post/6956501799327137828)
-   [clean-jsdoc-theme](https://github.com/ankitskvmdam/clean-jsdoc-theme)

