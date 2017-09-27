import {
	transform,
} from "babel-core";

import jsxControlStatements from 'jsx-control-statements';

const pragma = 'React.createElement';


export default code => {
	let jsxCode = (transform(code, {
		plugins: [jsxControlStatements, ["transform-react-jsx", {
			pragma, // default pragma is React.createElement
			useBuiltIns: true
		}]]
	}).code || '').trim();

	let index = jsxCode.indexOf(pragma);


	if(index !== 0) {
		jsxCode = `
			${jsxCode.slice(0, index)}

			return ${jsxCode.slice(index)}
		`;
	} else {
		jsxCode = `return ${jsxCode}`;
	}

	return jsxCode;
};
