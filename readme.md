# lesx-jsx 

> 将jsx语法转化为纯粹的`React.createElement`，无其他多余代码；同时，支持`jsx-control-statement`控制流标签。


## TODO

必须由`babel-core`的实现转化为`lesx-parser`、`babel-traverse`、`babel-generator`三步曲实现。

## Installation

Grab it from npm

```shell
npm install lesx-jsx
```

## Usage

```js
const lesxJsx = require('./');

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
