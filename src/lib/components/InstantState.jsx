import React from "react";
import PropTypes from "prop-types";

export default class InstantState extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		let value = e.target.value;
		let success = true;
		switch (e.target.type) {
			case "number":
				value = Number(value);
				break;
			case "checkbox":
				value = value === "true";
				break;
			case "textarea":
				try {
					value = JSON.parse(value);
				} catch (e) {
					success = false;
				}
				break;
			default:
				break;
		}
		if (success) {
			this.props.setComponentState(e.target.name, value);
		}
	}

	render() {
		const { componentState } = this.props;
		const styles = {
			instantState: {
				display: "inline-block",
				position: "absolute",
				top: "4px",
				right: "4px",
				bottom: "4px",
				left: "4px",
			},
		};
		return (
			<div style={styles.instantState}>
				{
					componentState && Object.keys(componentState).length > 0 ? (
					Object.keys(componentState).map(s => {
						let stateInput;
						switch (typeof componentState[s]) {
							case "string":
								stateInput = (
									<label className="pt-label">
										{s}
										<input
											type="text"
											className="pt-input"
											onChange={this.onChange}
											name={s}
											value={`${componentState[s]}`}
										/>
									</label>
								);
								break;
							case "number":
								stateInput = (
									<label className="pt-label">
										{s}
										<input
											type="number"
											className="pt-input"
											onChange={this.onChange}
											name={s}
											value={`${componentState[s]}`}
										/>
									</label>
								);
								break;
							case "boolean":
								stateInput = (
									<label className="pt-control pt-switch">
										<input
											name={s}
											value={componentState[s] || "false"}
											type="checkbox"
											onChange={this.onChange}
										/>
										<span className="pt-control-indicator" />
										{s}
									</label>
								);
								break;
							case "object":
								stateInput = (
									<label className="pt-label">
										{s}
										<textarea
											rows="4"
											cols="40"
											className="pt-input pt-fill"
											onChange={this.onChange}
											name={s}
											value={JSON.stringify(componentState[s])}
										/>
									</label>
								);
								break;
							default:
								stateInput = (
									<label className="pt-label">
										{s}
										<input
											type="text"
											className="pt-input"
											onChange={this.onChange}
											name={s}
											value={`${componentState[s]}`}
										/>
									</label>
								);
								break;
						}
						return <div key={s}>{stateInput}</div>;
					})) : 'No state detected'}
			</div>
		);
	}
}

InstantState.propTypes = {
	componentState: PropTypes.object,
	setComponentState: PropTypes.func,
};
