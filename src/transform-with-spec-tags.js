import {
	transform,
} from "./babel-core";

import jsxControlStatements from 'jsx-control-statements';


export default code => {
	return transform(code, {
		plugins: [jsxControlStatements, ["transform-react-jsx", {
			pragma: "React.createElement", // default pragma is React.createElement
			useBuiltIns: true
		}]]
	}).code;
};
