import React, { Component } from "react";
import Instant from "../../../lib/components/Instant.jsx";

export default class FunctionalStateless extends Component {
  state = {
    js: `const FunctionalStateless = ({ name }) => (
      <div>Hi { name }!</div>
  );

  FunctionalStateless.propTypes = {
    name: React.PropTypes.string
  };
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
        defaultProps={{
          name: "me"
        }}
        onSave={this.update}
        text={this.state.js}
        css={this.state.css}
      />
    );
  }
}
