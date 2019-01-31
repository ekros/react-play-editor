import React from "react";
import PropTypes from "prop-types";
import { Button, Dialog } from "@blueprintjs/core";
import {
  HorizontalLayout,
  VerticalLayout,
  Panel,
  Separator
} from "nice-react-layout";
import Examples from "./examples/Examples.jsx";
import Instant from "../lib/components/Instant.jsx";

export default class App extends React.Component {
  static propTypes = {};

  state = {
    css: undefined,
    text: undefined,
    lastUpdated: undefined,
    examplesVisible: false
  };

  load = id => {
    this.setState({
      css: localStorage.getItem(`${id}.css`),
      text: localStorage.getItem(`${id}.text`),
      lastUpdated: localStorage.getItem(`${id}.lastUpdated`)
    });
  };

  save = (id, js, css, cb) => {
    const lastUpdated = new Date();
    this.setState({ text: js, css, lastUpdated: lastUpdated.toISOString() });
    localStorage.setItem(`${id}.text`, js);
    localStorage.setItem(`${id}.css`, css);
    localStorage.setItem(`${id}.lastUpdated`, lastUpdated.toISOString());
    cb();
  };

  toggleExamples = () => {
    this.setState({ examplesVisible: !this.state.examplesVisible });
  };

  render() {
    const { css, examplesVisible, text, lastUpdated } = this.state;
    return (
      <VerticalLayout customCss={{ width: "100vw" }}>
        <Panel>
          <Instant
            id="main"
            css={css}
            defaultEditorTheme="ambiance"
            editorOptions={{
              lineNumbers: true
            }}
            autosave
            lastUpdated={new Date(lastUpdated)}
            load={this.load}
            onSave={(id, js, css, cb) => {
              this.save(id, js, css, cb);
            }}
            text={text}
            title="React Play"
          />
        </Panel>
        <Panel proportion="0 30px">
          <Button onClick={this.toggleExamples}>
            {examplesVisible ? "Hide examples" : "Show examples"}
          </Button>
          <Dialog
            isOpen={examplesVisible}
            onClose={this.toggleExamples}
            title="Examples"
            style={{
              width: 900
            }}
          >
            <Examples />
          </Dialog>
        </Panel>
      </VerticalLayout>
    );
  }
}