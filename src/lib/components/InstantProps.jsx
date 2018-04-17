import React from "react";
import PropTypes from "prop-types";

export default class InstantProps extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.state = {};
	}
	onChange(e) {
		let value = e.target.value;
		let success = true;
		switch (e.target.type) {
			case "number":
				value = Number(value) || undefined;
				break;
			case "checkbox":
				value = value === "true" || value === "on" ? false : true;
				break;
			default:
				break;
		}
		if (success) {
			this.props.setComponentProp(e.target.name, value);
		}
	}
	render() {
		const { componentProps, propTypes } = this.props;
		const inputs =
			propTypes &&
			Object.keys(propTypes).length > 0 &&
			Object.keys(propTypes).map(p => {
				if (propTypes[p]) {
					// const label = <label htmlFor={p}>{p}</label>;
					let input;
					if (propTypes[p].includes("PropTypes.string")) {
						input = (
							<label className="pt-label">
								{p}
								<input
									type="text"
									placeholder={p}
									className="pt-input"
									name={p}
									value={componentProps[p] || ""}
									onChange={this.onChange}
								/>
							</label>
						);
					} else if (propTypes[p].includes("PropTypes.number")) {
						input = (
							<label className="pt-label">
								{p}
								<input
									type="number"
									placeholder={p}
									className="pt-input"
									name={p}
									value={componentProps[p] || ""}
									onChange={this.onChange}
								/>
							</label>
						);
					} else if (propTypes[p].includes("PropTypes.bool")) {
						input = (
							<label className="pt-control pt-switch">
								<input
									name={p}
									value={componentProps[p] || "false"}
									type="checkbox"
									onChange={this.onChange}
								/>
								<span className="pt-control-indicator" />
								{p}
							</label>
						);
					} else if (propTypes[p].includes("PropTypes.func")) {
						input = null;
					} else if (
						propTypes[p].includes("PropTypes.object") ||
						propTypes[p].includes("PropTypes.array")
					) {
						input = (
							<label className="pt-label">
								{p}
								<textarea
									rows="4"
									cols="40"
									className="pt-input pt-fill"
									name={p}
									onChange={this.onChange}
									value={
										typeof componentProps[p] === "object"
											? JSON.stringify(componentProps[p])
											: componentProps[p]
									}
								/>
							</label>
						);
					} else {
						input = (
							<label className="pt-label">
								{p}
								<input
									type="text"
									placeholder={p}
									name={p}
									value={JSON.stringify(componentProps[p])}
									onChange={this.onChange}
								/>
							</label>
						);
					}
					return <div key={p}>{input}</div>;
				}
			});
		const styles = {
			instantProps: {
				display: "inline-block",
				position: "absolute",
				top: "4px",
				right: "4px",
				bottom: "4px",
				left: "4px",
			},
		};

		return (
			<div style={styles.instantProps}>
				{inputs &&
				inputs.length > 0 &&
				!(inputs.length === 1 && inputs[0] === undefined)
					? inputs
					: "No props detected"}
			</div>
		);
	}
}

InstantProps.propTypes = {
	componentProps: PropTypes.object,
	propTypes: PropTypes.object,
	setComponentProp: PropTypes.func,
};
