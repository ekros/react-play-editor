import React, { Component } from "react";
import PropTypes from "prop-types";
import Instant from "../../../lib/components/Instant.jsx";

export default class PropsAndState extends Component {
	render() {
		return (
			<Instant
				defaultEditorTheme="ambiance"
				defaultProps={{
					num: 2,
				}}
				defaultState={{
					num: 70,
				}}
				editorOptions={{
					lineNumbers: true,
				}}
				css=".my-styled-div { color: lime; font-weight: bold; }"
				text={`
					const PropsAndState = class PropsAndState extends React.Component {
						render() {
							const { str, num, boolean, fn, obj, arr } = this.props;
							return (
								<div>
									<div>This is a string {str}</div>
									<div>This is a number {num}</div>
									<div>A boolean {boolean} <input type="checkbox" checked={boolean} /></div>
									<button onClick={fn}>This button triggers an action</button>
									<div>An object:</div>
									<div>{obj && JSON.stringify(obj)}</div>
									<div>An array:</div>
									<div>{arr && JSON.stringify(arr)}</div>
									<div className="my-styled-div">This is a css-styled div</div>
								</div>
							);
						}
					};
					
					PropsAndState.propTypes = {
						str: PropTypes.string,
						num: PropTypes.number,
						boolean: PropTypes.bool,
						fn: PropTypes.func,
						obj: PropTypes.object,
						arr: PropTypes.array
					}
				`}
			/>
		);
	}
}
