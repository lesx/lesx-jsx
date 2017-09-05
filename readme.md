# lesx-jsx 

> 将jsx语法转化为纯粹的`React.createElement`，无其他多余代码；同时，支持`jsx-control-statement`控制流标签。


## TODO

~~必须由`babel-core`的实现转化为`lesx-parser`、`babel-traverse`、`babel-generator`三步曲实现。(因为后面需要被转化的代码肯定不会包含`script/style`之类的标签，所以没必要)~~  

因为`babel`的插件机制特别恶心，以上操作无法转，要实现也只能到`babel-core`的核心代码里实现！  

如果需要转换`script/style`之类的特殊标签，需要如下引用：

```javascript
const lesxJsx = require('lesx-jsx/lib/transform-with-spec-tags');
```

## Installation

Grab it from npm

```shell
npm install lesx-jsx
```

## Usage

```js
const lesxJsx = require('lesx-jsx');

const source = `
    <div x="x" {...y} z>
        123
        <If condition={ test }>
            <span>Truth</span>
        </If>
    </div>
`;


const code = lesxJsx(source);


console.log('code:', code);

/**
React.createElement(
    "div",
    Object.assign({ x: "x" }, y, { z: true }),
    "123",
    test ? React.createElement(
        "span",
        null,
        "Truth"
    ) : null
);
*/

```
