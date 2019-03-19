import React, { Component } from "react";
import Instant from "../../../lib/components/Instant.jsx";

export default class Blank extends Component {
  state = {
    js: undefined,
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
      />
    );
  }
}
