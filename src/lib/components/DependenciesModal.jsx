import React from "react";
import PropTypes from "prop-types";
import { Button, Dialog, Icon } from "@blueprintjs/core";

export default class DependenciesModal extends React.Component {
	constructor(props) {
		super(props);
		this.handleKeydown = this.handleKeydown.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	componentDidMount() {
		document.addEventListener("keydown", this.handleKeydown);
	}
	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeydown);
	}

	handleKeydown(ev) {
		if (ev.keyCode === 13) {
			this.props.loadDeps();
			this.props.onClose();
		}
	}
	onChange(ev) {
		let dependencies = this.props.dependencies.slice(0);
		dependencies[Number(ev.target.name)] = ev.target.value;
		this.props.updateDependencies(dependencies);
	}

	render() {
		const {
			addDependency,
			deleteDependency,
			dependencies,
			isOpen,
			onClose,
		} = this.props;
		const styles = {
			actionIcon: {
				cursor: "pointer",
			},
			input: {
				width: "480px",
			},
		};
		return (
			<Dialog isOpen={isOpen} title="Dependencies" onClose={onClose}>
				{dependencies &&
					dependencies.map((dep, index) => {
						return (
							<div>
								<input
									name={index}
									style={styles.input}
									className="pt-input"
									onChange={this.onChange}
									value={dep || ""}
								/>
								<Icon
									style={styles.actionIcon}
									iconName="cross"
									onClick={() => deleteDependency(index)}
								/>
							</div>
						);
					})}
				<Button onClick={addDependency}>Add</Button>
			</Dialog>
		);
	}
}

DependenciesModal.propTypes = {
	addDependency: PropTypes.func.isRequired,
	deleteDependency: PropTypes.func.isRequired,
	dependencies: PropTypes.arrayOf(PropTypes.string),
	isOpen: PropTypes.bool,
	loadDeps: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	updateDependencies: PropTypes.func.isRequired,
};
