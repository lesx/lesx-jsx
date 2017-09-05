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
