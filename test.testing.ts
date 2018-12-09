import RoactRodux from ".";
import Roact from "rbx-roact";

interface TestState {
	value: number;
}

interface TestProps {
	value: number;
	onClick: () => void;
}

class TestComponent extends Roact.Component<TestState, TestProps> {
	public render(): Roact.Element {
		return Roact.createElement("Frame");
	}
}

const Dud = RoactRodux.connect();

const HigherConnector = RoactRodux.connect<TestState, TestProps>(
	() => {
		return (state: TestState, props: TestProps) => {
			return { value: 10 };
		};
	},
	dispatch => {},
);

const Connector = RoactRodux.connect<TestState, TestProps>(
	(state: TestState, props: TestProps) => {
		return { value: 10 };
	},
	dispatch => {
		return {
			onClick: () => {
				dispatch({ type: "increment" });
			},
		};
	},
);

export = Connector(TestComponent);
