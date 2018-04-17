import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {
	parseComponentName,
	parseFunctionalComponentName,
} from "../helpers/parsers.js";

export default class InstantPreview extends React.Component {
	constructor(props) {
		super(props);
		this.compileCode = this.compileCode.bind(this);
		this.executeCode = this.executeCode.bind(this);
	}
	componentDidMount() {
		const { children } = this.props;
		if (children && children.length > 0) {
			this.executeCode();
		}
	}
	componentDidUpdate() {
		const { children } = this.props;
		if (children && children.length > 0) {
			this.executeCode();
		}
	}

	compileCode() {
		const { children } = this.props;
		// const component = `<${componentName} />`;
		return window.Babel.transform(children, {
			presets: ["es2015", "react"],
		}).code;
	}
	executeCode() {
		const { componentName, componentProps, componentState } = this.props;
		var mountNode = this.refs.mount;

		// try { // TODO: WHY IS THIS NECESARY? IT SEEMS TO WORK WITHOUT THIS HACK
		// 	ReactDOM.unmountComponentAtNode(mountNode);
		// } catch (e) {}
		try {
			const compiledCode = this.compileCode();
			const executedCode = eval(compiledCode);
			const props =
				componentProps &&
				Object.keys(componentProps).map(p => {
					if (
						this.props.propTypes &&
						Object.keys(this.props.propTypes).length > 0
					) {
						if (this.props.propTypes[p].includes("PropTypes.func")) {
							return `${p}: ${p => console.log(p.target)}`;
						} else if (
							this.props.propTypes[p].includes("PropTypes.object") ||
							this.props.propTypes[p].includes("PropTypes.array")
						) {
							return `${p}: ${componentProps[p]}`;
						} else {
							return `${p}: ${JSON.stringify(componentProps[p])}`;
						}
					} else {
						return undefined;
					}
				});
			const isClassComponent = parseComponentName(compiledCode) != null;
			const functionalComponentName = parseFunctionalComponentName(
				compiledCode
			);
			let component;
			let executedPropTypes;
			if (isClassComponent) {
				executedPropTypes = executedCode.type && executedCode.type.propTypes;
				const componentCall = `React.createElement(${componentName}, { ${props} })`;
				component = ReactDOM.render(
					eval(compiledCode + "\n" + componentCall),
					mountNode
				);
			} else if (functionalComponentName) {
				const functionalComponentCall = `${functionalComponentName}(${JSON.stringify(
					componentProps
				)})`;
				component = ReactDOM.render(
					eval(compiledCode + "\n" + functionalComponentCall),
					mountNode
				);
			}
			// only set state in case is a class component
			if (isClassComponent) {
				component.setState({ ...component.state, ...componentState });
			}
			return executedPropTypes;
		} catch (err) {
			setTimeout(function() {
				ReactDOM.render(
					<div className="pt-callout pt-intent-danger">
						<h5>Error</h5>
						{err.toString()}
					</div>,
					mountNode
				);
			}, 500);
		}
	}

	render() {
		return <div ref="mount" className="react-instant-editor__preview" />;
	}
}

InstantPreview.propTypes = {
	children: PropTypes.any,
	componentName: PropTypes.string.isRequired,
	componentProps: PropTypes.object,
	componentState: PropTypes.object,
	propTypes: PropTypes.object,
};
