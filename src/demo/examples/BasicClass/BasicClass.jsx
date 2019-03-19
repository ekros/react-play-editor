import React, { Component } from "react";
import Instant from "../../../lib/components/Instant.jsx";

export default class BasicClass extends Component {
  state = {
    js: `const BasicClass = class BasicClass extends React.Component {
        render() {
          return (<div>
            This is a basic class component without props
          </div>);
        }
      }
      `,
    css: undefined
  };
  update = (id, js, css) => {
    this.setState({ js, css });
  };

  render() {
    return (
      <Instant
        defaultEditorTheme="ambiance"
        editorOptions={{
          lineNumbers: true
        }}
        onSave={this.update}
        text={this.state.js}
        css={this.state.css}
      />
    );
  }
}
