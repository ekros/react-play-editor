import React, { Component } from "react";
import Instant from "../../../lib/components/Instant.jsx";

export default class BasicClass extends Component {
	render() {
		return (
			<Instant
				defaultEditorTheme="ambiance"
				editorOptions={{
					lineNumbers: true,
				}}
				text={`const BasicClass = class BasicClass extends React.Component {
            render() {
              return (<div>
                This is a basic class component without props
              </div>);
            }
          }
          `}
			/>
		);
	}
}
