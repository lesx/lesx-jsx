const {
	transform,
} = require("babel-core");


export default code => {
	return transform(code, {
		plugins: ["jsx-control-statements", ["transform-react-jsx", {
			pragma: "React.createElement", // default pragma is React.createElement
			useBuiltIns: true
		}]]
	}).code
};
