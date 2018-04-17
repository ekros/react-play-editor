import React, { Component } from "react";
import Instant from "../../../lib/components/Instant.jsx";

export default class FunctionalStateless extends Component {
	render() {
		return (
			<Instant
				defaultEditorTheme="ambiance"
				editorOptions={{
					lineNumbers: true,
				}}
				defaultProps={{
					name: "me"
				}}
				text={`const FunctionalStateless = ({ name }) => (
					<div>Hi { name }!</div>
			);

			FunctionalStateless.propTypes = {
				name: React.PropTypes.string
			};
			`}
			/>
		);
	}
}
