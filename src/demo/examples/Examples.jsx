import React from "react";
import styled from "styled-components";
import FunctionalStateless from "./FunctionalStateless/FunctionalStateless.jsx";
import BasicClass from "./BasicClass/BasicClass.jsx";
import Blank from "./Blank/Blank.jsx";
import PropsAndState from "./PropsAndState/PropsAndState.jsx";

import "./index.css";

const ExampleCard = styled.div`
  width: 900px;
`;

const Examples = () => (
  <div>
    <ExampleCard className="pt-card">
      <h5>Blank editor</h5>
      <Blank />
    </ExampleCard>
    <ExampleCard className="pt-card">
      <h5>Functional stateless</h5>
      <FunctionalStateless />
    </ExampleCard>
    <ExampleCard className="pt-card">
      <h5>Basic class component</h5>
      <BasicClass />
    </ExampleCard>
    <ExampleCard className="pt-card">
      <h5>Props and state</h5>
      <PropsAndState />
    </ExampleCard>
  </div>
);

export default Examples;
