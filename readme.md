# lesx-jsx 

> 将jsx语法转化为`React.createElement`，支持控制流标签。


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

```