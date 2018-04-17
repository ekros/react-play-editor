import React from 'react';
import PropTypes from 'prop-types';
import { Button } from "@blueprintjs/core";

export default class TabGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTabIndex: 0,
    };
    this.setTabIndex = this.setTabIndex.bind(this);
  }
  
  setTabIndex(index) {
    this.setState({ selectedTabIndex: index });
  }

  render() {
    const { children, tabNames } = this.props;
    const { selectedTabIndex } = this.state;
    const styles = {
      content: {
        position: 'absolute',
        top: '30px',
        right: 0,
        bottom: 0,
        left: 0,
        overflowY: 'auto',
      },
      selectedButton: {
        border: '1px solid black',
        fontWeight: 'bold',
        boxShadow: 'inset 0px 0px 2px black',
      },
      tabGroup: {
        height: '100%',
      },
    };
    return (
      <div>
        {
          tabNames && tabNames.map((tab, index) => {
            return <Button type="button" key={tab} style={index === selectedTabIndex ? styles.selectedButton : null} onClick={() => this.setTabIndex(index)}>{tab}</Button>
          })
        }
        <div style={styles.content}>
          {children[selectedTabIndex]}
        </div>
      </div>
    );
  }
}

TabGroup.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  tabNames: PropTypes.arrayOf(PropTypes.string),
};
