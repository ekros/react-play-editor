import React, { Component } from "react";
import Instant from "../../../lib/components/Instant.jsx";

export default class Blank extends Component {
	render() {
		return (
			<Instant
				defaultEditorTheme="ambiance"
				editorOptions={{
					lineNumbers: true,
				}}
			/>
		);
	}
}
