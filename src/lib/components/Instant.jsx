import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  HorizontalLayout,
  VerticalLayout,
  Panel,
  Separator
} from "nice-react-layout";
import { Button } from "@blueprintjs/core";
import InstantEditor from "./InstantEditor.jsx";
import InstantEditorCSS from "./InstantEditorCSS.jsx";
import InstantPreview from "./InstantPreview.jsx";
import InstantProps from "./InstantProps.jsx";
import InstantState from "./InstantState.jsx";
import DependenciesModal from "./DependenciesModal.jsx";
import TabGroup from "./TabGroup.jsx";
import {
  parseComponentName,
  parseFunctionalComponentName
} from "../helpers/parsers.js";

/*
  Examples of valid text

  // a div with a component inside
  const a = 42;
  var b = function() { return 5 };
  var onClick = function() { alert ('hi!!') };
  var Button = function() { return <button onClick={onClick}>click</button> };
  <div>
  	Hello world. The result is {a} and {b()}
    <Button />
  </div>

  // functional component (note that the component must be called at the end)
  var Test = ({text}) => {
  	return <div>afsdf {text}</div>;
  };

  // class component
  var Test = class Test extends React.Component {
    render() {
      return <div>Hi there!! Here is your prop {this.props.text}</div>;
    }
  };
  Test.propTypes = {
    text: React.PropTypes.string
  };
*/
class Instant extends Component {
  constructor(props) {
    super(props);
    this.saveDelay = undefined;
    this.state = {
      componentName: undefined,
      componentProps: props.defaultProps || {},
      componentState: props.defaultState || {},
      cssDependencies: props.cssDependencies || [],
      dependencies: props.dependencies || [],
      cssDependenciesOpen: false,
      dependenciesOpen: false,
      propTypes: undefined,
      pendingChanges: false,
      pendingText: undefined,
      pendingCss: undefined
    };
    this.action = this.action.bind(this);
    this.addDependency = this.addDependency.bind(this);
    this.addCSSDependency = this.addCSSDependency.bind(this);
    this.compileCode = this.compileCode.bind(this);
    this.deleteDependency = this.deleteDependency.bind(this);
    this.deleteCSSDependency = this.deleteCSSDependency.bind(this);
    this.executeCode = this.executeCode.bind(this);
    this.firstIndexOfLine = this.firstIndexOfLine.bind(this);
    this.getPropTypes = this.getPropTypes.bind(this);
    this.loadDeps = this.loadDeps.bind(this);
    this.loadCSSDeps = this.loadCSSDeps.bind(this);
    this.onDependenciesClose = this.onDependenciesClose.bind(this);
    this.onCSSDependenciesClose = this.onCSSDependenciesClose.bind(this);
    this.parsePropTypes = this.parsePropTypes.bind(this);
    this.setComponentProp = this.setComponentProp.bind(this);
    this.setComponentState = this.setComponentState.bind(this);
    this.setPropTypes = this.setPropTypes.bind(this);
    this.toggleCSSDependencies = this.toggleCSSDependencies.bind(this);
    this.toggleDependencies = this.toggleDependencies.bind(this);
    this.updateComponent = this.updateComponent.bind(this);
    this.updateDependencies = this.updateDependencies.bind(this);
    this.updateCSSDependencies = this.updateCSSDependencies.bind(this);
    this.updateCSS = this.updateCSS.bind(this);
  }
  componentDidMount() {
    const { autosave, id, load } = this.props;
    // load external resources
    this.loadDeps();

    // call load to load saved text
    if (load) {
      load(id, autosave);
    }

    // init actions
    setTimeout(() => {
      const { propTypes } = this.state;
      const componentProps = {};
      propTypes &&
        Object.keys(propTypes).forEach(p => {
          if (
            propTypes &&
            propTypes[p] &&
            propTypes[p].includes("PropTypes.func")
          ) {
            componentProps[p] = this.action;
          }
        });
      const defaultProps = Object.assign({}, this.state.componentProps);
      this.setState({ componentProps: { ...componentProps, ...defaultProps } });
      this.executeCode(this.props.text);
    }, 500);

    // HACK: wait before updating the component. We need to extract the component name, proptypes, etc..
    setTimeout(() => {
      this.updateComponent(this.state.text);
    }, 2000);
  }

  action() {
    console.info("Action");
  }
  addDependency() {
    const newDeps = this.state.dependencies.slice(0);
    newDeps.push(undefined);
    this.setState({ dependencies: newDeps });
  }
  addCSSDependency() {
    const newDeps = this.state.cssDependencies.slice(0);
    newDeps.push(undefined);
    this.setState({ cssDependencies: newDeps });
  }
  compileCode(text) {
    const currentText = text || this.state.text;
    // const { componentName } = this.state;
    // const component = `<${componentName} />`;
    return window.Babel.transform(currentText, {
      presets: ["es2015", "react"]
    }).code;
  }
  deleteDependency(index) {
    const newDeps = this.state.dependencies.slice(0);
    newDeps.splice(index, 1);
    this.setState({ dependencies: newDeps });
  }
  deleteCSSDependency(index) {
    const newDeps = this.state.cssDependencies.slice(0);
    newDeps.splice(index, 1);
    this.setState({ cssDependencies: newDeps });
  }
  executeCode(text) {
    var mountNode = this.refs.mount;
    try {
      ReactDOM.unmountComponentAtNode(mountNode);
    } catch (e) {}
    try {
      const compiledCode = this.compileCode(text);
      const executedCode = eval(compiledCode);
      const componentName = parseComponentName(compiledCode);
      const functionalComponentName = parseFunctionalComponentName(
        compiledCode
      );
      const componentCall = `React.createElement(${componentName})`;
      const functionalComponentCall = `${functionalComponentName}({})`;
      let component;
      let propTypes;
      if (componentName) {
        propTypes =
          (executedCode.type && executedCode.type.propTypes) || executedCode;
        component = ReactDOM.render(
          eval(compiledCode + "\n" + componentCall),
          mountNode
        );
      } else if (functionalComponentName) {
        propTypes = executedCode;
        let evalCode;
        try {
          evalCode = eval(compiledCode + "\n" + functionalComponentCall);
        } catch (e) {
          console.log("e", e);
        }
        component = ReactDOM.render(evalCode, mountNode);
      }
      this.setState({
        componentName: componentName || functionalComponentName,
        componentState: { ...this.props.defaultState, ...component.state }
      });
      return propTypes;
    } catch (err) {
      setTimeout(function() {
        ReactDOM.render(
          <div style={{ color: "red" }}>{err.toString()}</div>,
          mountNode
        );
      }, 500);
    }
  }
  // returns the index of the first character in the line, given any index of the line
  // str: the string to search in
  // pos: position of a character in the line where we want to know the first index
  firstIndexOfLine(str, pos) {
    let index;
    for (let i = pos; i > 0; i--) {
      if (str[i] === "\n") {
        index = i + 1;
        break;
      }
    }
    return index;
  }
  getPropTypes(componentName, str) {
    let result = {};
    try {
      const props = this.parsePropTypes(componentName, str);
      let propsContent = props
        .substring(props.indexOf("{") + 1, props.indexOf("}") - 1)
        .replace(" ", "");
      let propArray = propsContent.split(",");
      let keys = propArray.map(p => {
        return p.split(":")[0].trim();
      });
      let values = propArray.map(p => {
        return p.split(":")[1] && p.split(":")[1].trim();
      });
      for (let i in keys) {
        result[keys[i]] = values[i];
      }
    } catch (e) {
      console.error(e);
    }
    return result;
  }
  loadDeps() {
    const { dependencies } = this.state;
    const deps = dependencies.slice(0);
    // iterate over all the 'instant-js-dep' scripts and remove unused ones
    const jsDeps =
      document.querySelectorAll("script[title=instant-js-dep]") || [];

    jsDeps.forEach(dep => {
      if (!deps.find(d => d.src === dep.src)) {
        dep.remove();
      }
    });
    // insert new deps in the DOM
    const head = document.getElementsByTagName("head")[0];
    deps.push(
      "https://cdnjs.cloudflare.com/ajax/libs/prop-types/15.6.1/prop-types.min.js"
    ); // add prop-types dep (required)
    deps.forEach(dep => {
      const script = document.createElement("script");
      script.title = "instant-js-dep";
      script.type = "text/javascript";
      script.src = dep;
      head.appendChild(script);
    });
  }
  loadCSSDeps() {
    const { cssDependencies } = this.state;
    const cssDeps =
      document.querySelectorAll("link[title=instant-css-dep]") || [];
    cssDeps.forEach(dep => {
      if (!cssDependencies.find(d => d.href === dep.href)) {
        dep.remove();
      }
    });
    const head = document.getElementsByTagName("head")[0];
    cssDependencies.forEach(dep => {
      const link = document.createElement("link");
      link.title = "instant-css-dep";
      link.ref = "stylesheet";
      link.href = dep;
      head.appendChild(link);
    });
  }
  onDependenciesClose() {
    this.loadDeps();
    this.setState({ dependenciesOpen: false });
  }
  onCSSDependenciesClose() {
    this.loadCSSDeps();
    this.setState({ cssDependenciesOpen: false });
  }
  parsePropTypes(componentName, str) {
    let string = str ? str : "";
    let curlyCount = 0;
    let initialPos = string.search(componentName + ".propTypes");
    let finalPos = initialPos;
    // let currentPos = initialPos;
    if (initialPos === -1) {
      return "";
    }
    let subString = string.substring(
      this.firstIndexOfLine(str, initialPos),
      string.length - 1
    );
    for (let i = 0; i < subString.length - 1; i++) {
      if (subString[i] === "{") {
        curlyCount += 1;
      } else if (subString[i] === "}") {
        curlyCount -= 1;
        if (curlyCount === 0) {
          finalPos = i + 1;
          break;
        }
      }
    }
    return subString.substring(0, finalPos);
  }
  setComponentProp(key, value) {
    const componentProps = Object.assign({}, this.state.componentProps);
    componentProps[key] = value;
    this.setState({ componentProps });
  }
  setComponentState(key, value) {
    const { componentState } = this.state;
    const newState = {};
    newState[key] = value;
    this.setState({ componentState: { ...componentState, ...newState } });
  }
  setPropTypes(propTypes) {
    if (propTypes && Object.keys(propTypes).length > 0) {
      this.setState({ propTypes });
    }
  }
  toggleCSSDependencies() {
    this.setState({ cssDependenciesOpen: !this.state.cssDependenciesOpen });
  }
  toggleDependencies() {
    this.setState({ dependenciesOpen: !this.state.dependenciesOpen });
  }
  updateComponent(text, ignoreEditable) {
    const { autosave, editable, id, onSave } = this.props;
    if (editable || ignoreEditable) {
      // call onSave if autosave is enabled // IDEA: in the future we can have a manual saving action
      if (text) {
        this.setState({ pendingText: text, pendingChanges: true });
        if (!this.saveDelay) {
          this.saveDelay = setTimeout(() => {
            onSave(id, this.state.pendingText, this.props.css, autosave, () => {
              this.setState({ pendingChanges: false });
            });
            clearTimeout(this.saveDelay);
            this.saveDelay = undefined;
          }, 2000);
        }
      }
      this.setPropTypes(
        this.getPropTypes(this.state.componentName, text || this.state.text)
      );
      if (text && text.length > 0) {
        this.executeCode(text);
      }
    }
  }
  updateDependencies(dependencies) {
    this.setState({ dependencies });
  }
  updateCSSDependencies(cssDependencies) {
    this.setState({ cssDependencies });
  }
  updateCSS(css) {
    const { autosave, editable, id, onSave } = this.props;
    if (editable) {
      if (css) {
        this.setState({ pendingCss: css, pendingChanges: true });
        if (!this.saveDelay) {
          this.saveDelay = setTimeout(() => {
            onSave(id, this.props.text, this.state.pendingCss, autosave, () => {
              this.setState({ pendingChanges: false });
            });
            clearTimeout(this.saveDelay);
            this.saveDelay = undefined;
          }, 2000);
        }
      }
    }
  }

  render() {
    const {
      autosave,
      css,
      defaultEditorTheme,
      editorOptions,
      editable,
      lastUpdated,
      text,
      title
    } = this.props;
    const {
      componentName,
      componentProps,
      componentState,
      cssDependencies,
      cssDependenciesOpen,
      dependencies,
      dependenciesOpen,
      pendingChanges,
      propTypes
    } = this.state;
    const StyledInstantPreview = styled.div`
      ${css};
    `;
    const styles = {
      dependenciesBadge: {
        background: "#222222",
        borderRadius: "4px",
        color: "lightgray",
        padding: "1px 3px"
      },
      dependenciesButton: {
        marginLeft: "10px"
      },
      horizontalLayout: {
        position: "absolute",
        height: "100%",
        width: "100%"
      },
      instantHeader: {
        backgroundColor: "#222",
        padding: "5px"
      },
      instantHeaderText: {
        color: "lightgray",
        fontSize: "18px",
        fontWeight: "bold",
        lineHeight: "30px"
      },
      mountNode: {
        display: "none"
      },
      saveButton: {
        float: "right"
      },
      statusText: {
        color: "gray",
        fontSize: "14px",
        float: "right",
        lineHeight: "30px"
      }
    };
    const editors = [
      <InstantEditor
        key="editor1"
        defaultEditorTheme={defaultEditorTheme}
        editable={editable}
        editorOptions={editorOptions}
        updateComponent={this.updateComponent}
      >
        {text}
      </InstantEditor>,
      <InstantEditorCSS
        key="editor2"
        defaultEditorTheme={defaultEditorTheme}
        editable={editable}
        editorOptions={editorOptions}
        updateComponent={this.updateCSS}
      >
        {css}
      </InstantEditorCSS>
    ];
    const propsAndState = [
      <InstantProps
        key="props"
        componentProps={componentProps}
        propTypes={propTypes}
        setComponentProp={this.setComponentProp}
      />,
      <InstantState
        key="state"
        componentState={componentState}
        setComponentState={this.setComponentState}
      />
    ];
    return (
      <div className="App">
        <DependenciesModal
          addDependency={this.addDependency}
          deleteDependency={this.deleteDependency}
          dependencies={dependencies}
          isOpen={dependenciesOpen}
          loadDeps={this.loadDeps}
          onClose={this.onDependenciesClose}
          updateDependencies={this.updateDependencies}
        />
        <DependenciesModal
          addDependency={this.addCSSDependency}
          deleteDependency={this.deleteCSSDependency}
          dependencies={cssDependencies}
          isOpen={cssDependenciesOpen}
          loadDeps={this.loadCSSDeps}
          onClose={this.onCSSDependenciesClose}
          updateDependencies={this.updateCSSDependencies}
        />
        <VerticalLayout>
          <Panel minHeight={40} proportion={1}>
            <div style={styles.instantHeader}>
              <span style={styles.instantHeaderText}>{title}</span>
              <Button
                style={styles.dependenciesButton}
                onClick={this.toggleDependencies}
              >
                JS Dependencies{" "}
                <span style={styles.dependenciesBadge}>
                  {(dependencies && dependencies.length) || "0"}
                </span>
              </Button>
              <Button
                style={styles.dependenciesButton}
                onClick={this.toggleCSSDependencies}
              >
                CSS Dependencies{" "}
                <span style={styles.dependenciesBadge}>
                  {(cssDependencies && cssDependencies.length) || "0"}
                </span>
              </Button>
              {autosave && pendingChanges ? (
                <small style={styles.statusText}>Saving...</small>
              ) : (
                <small style={styles.statusText}>
                  {lastUpdated
                    ? `Last saved on ${lastUpdated.toLocaleString()}`
                    : null}
                </small>
              )}
            </div>
          </Panel>
          <Panel proportion={6}>
            <HorizontalLayout customCss={styles.horizontalLayout}>
              <Panel proportion={2}>
                <TabGroup tabNames={["jsx", "css"]}>{editors}</TabGroup>
              </Panel>
              <Separator />
              <Panel proportion={1}>
                <TabGroup tabNames={["props", "state"]}>
                  {propsAndState}
                </TabGroup>
              </Panel>
            </HorizontalLayout>
          </Panel>
          <Separator />
          <Panel proportion={4}>
            <StyledInstantPreview>
              <InstantPreview
                componentName={componentName}
                componentProps={componentProps}
                componentState={componentState}
                propTypes={propTypes}
              >
                {text}
              </InstantPreview>
            </StyledInstantPreview>
          </Panel>
        </VerticalLayout>
        <div ref="mount" style={styles.mountNode} />
      </div>
    );
  }
}

Instant.propTypes = {
  autosave: PropTypes.bool,
  css: PropTypes.string,
  defaultEditorTheme: PropTypes.string,
  defaultProps: PropTypes.object,
  defaultState: PropTypes.object,
  dependencies: PropTypes.arrayOf(PropTypes.string),
  editable: PropTypes.bool,
  editorOptions: PropTypes.object,
  id: PropTypes.string.isRequired, // used to identify the editor when multiple editors are loaded
  lastUpdated: PropTypes.object,
  load: PropTypes.func, // you can use this function to load saved data (for example in the localstorage)
  onSave: PropTypes.func,
  text: PropTypes.string,
  title: PropTypes.string
};

Instant.defaultProps = {
  autosave: false,
  editable: true,
  onSave: undefined,
  title: undefined
};

export default Instant;
