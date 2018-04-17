import React from "react";
import PropTypes from "prop-types";
import "./InstantEditorCSS.css";
import { _ } from "underscore";

export default class InstantEditorCSS extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editableText: "",
			cursor: { line: 0, ch: 0 },
			focused: false,
		};
		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.myCodeMirror = undefined;
	}

	componentDidMount() {
		// this.componentWillReceiveProps({...this.props});
		const {
			children,
			defaultEditorTheme,
			editable,
			editorOptions,
		} = this.props;
		this.setState(
			{
				editableText: children,
			},
			() => {
				this.refs.instantEditorCss.innerHTML = "";
				this.myCodeMirror = window.CodeMirror(
					this.refs.instantEditorCss,
					{
						value: children,
						mode: "css",
						autofocus: this.state.focused,
						theme: defaultEditorTheme || "default",
						readOnly: !editable,
						...editorOptions,
					}
				);
				this.myCodeMirror.on("change", this.onChange);
				this.myCodeMirror.on("focus", this.onFocus);
				this.myCodeMirror.on("blur", this.onBlur);
				this.myCodeMirror.setCursor(this.state.cursor);
			}
		);
	}

	onChange(obj) {
		this.setState({
			cursor: this.myCodeMirror.getCursor(),
		});
		let textLines = [];
		_.each(obj.doc.children[0].lines, line => {
			textLines.push(line.text);
		});
		const text = textLines.join("\n");
		this.props.updateComponent(text);
		// Meteor.call('loaded_components.save', {
		//   index: this.props.selectedComponentIndex,
		//   text
		// }, (err, res) => {
		//   if (err) {
		//     alert(err);
		//   } else {
		//     console.log("success!");
		//     // success!
		//   }
		// });
	}

	onFocus() {
		this.setState({
			focused: true,
		});
	}

	onBlur() {
		this.setState({
			focused: false,
		});
	}

	//componentWillReceiveProps(nextProps) {
		// this.setState({
		//   editableText: nextProps.children,
		// }, () => {
		//   document.getElementById('instant-editor-css').innerHTML = '';
		//   this.myCodeMirror = window.CodeMirror(document.getElementById('instant-editor-css'), {
		//     value: nextProps.children,
		//     mode: 'javascript',
		//     autofocus: this.state.focused,
		//   });
		//   this.myCodeMirror.on("change", this.onChange);
		//   this.myCodeMirror.on("focus", this.onFocus);
		//   this.myCodeMirror.on("blur", this.onBlur);
		//   this.myCodeMirror.setCursor(this.state.cursor);
		// });
	//}

	render() {
		return <div style={{ height: '100%' }} ref="instantEditorCss" />;
	}
}

InstantEditorCSS.propTypes = {
	children: PropTypes.string,
	defaultEditorTheme: PropTypes.string,
	editable: PropTypes.bool,
	editorOptions: PropTypes.object,
	selectedComponentIndex: PropTypes.number,
	updateComponent: PropTypes.func,
};

InstantEditorCSS.defaultProps = {
	children: "",
};
