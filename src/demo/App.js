import React from "react";
import styled from "styled-components";
import FunctionalStateless from "./examples/FunctionalStateless/FunctionalStateless.jsx";
import BasicClass from "./examples/BasicClass/BasicClass.jsx";
import Blank from "./examples/Blank/Blank.jsx";
import PropsAndState from "./examples/PropsAndState/PropsAndState.jsx";

const ExampleCard = styled.div`width: 900px;`;

const App = () => (
	<div>
		<br />
		<div style={{ width: "900px" }}>
			<h1 style={{ display: "inline-block" }}>react-play-editor</h1>
			<a style={{ float: "right" }} href="https://github.com/ekros/react-play-editor">
				<img style={{ width: "32px", height: "32px" }} src="https://github.com/favicon.ico" alt="github" />
			</a>
			<p>Create React components and play with props and state using auto-generated forms.</p>
		</div>
		<br />
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

export default App;
