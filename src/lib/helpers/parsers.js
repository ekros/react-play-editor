// parses transpiled es5 code
export const parseComponentName = text => {
	// use a reg exp to match 'var [component] = function (_React$Component)'
	let name;
	try {
		const regExp = /var (.*) = function \(_React\$Component\)/;
		const match = regExp.exec(text);
		name = match && match[1];
	} catch (e) {
		console.error(e);
	}
	return name;
};

// parses transpiled es5 code
export const parseFunctionalComponentName = text => {
	// use a reg exp to match 'function [component](_ref)'
	let name;
	try {
		const regExp = /var (.*) = function .*\(_ref\)/;
		const match = regExp.exec(text);
		name = match && match[1];
	} catch (e) {
		console.error(e);
	}
	return name;
};
