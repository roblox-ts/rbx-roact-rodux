import Roact = require("rbx-roact");

export as namespace RoactRodux;
export = RoactRodux;

interface StoreProviderProps {
	store: Rodux.Store;
}

type ContainsKeys<S, K extends keyof S> = Pick<S, K> | S | null;
type MapDispatcherToProps<P> = (
	dispatch: (
		dispatchArgs: { type: string } & { [name: string]: any },
	) => void,
) => Partial<ContainsKeys<P, keyof P>>;
//type Connector<S, P> = (component: (typeof Roact.Component<S, P>)) => Roact.Component<S, P>;

interface RenderablePropsAndStateClass<S, P>
	extends Roact.RenderablePropsClass<P> {}

interface RoactRoduxWrapper<S, P> {
	(component: RenderablePropsAndStateClass<S, P>): RoduxConnection<S, P>;
}

interface RoduxConnection<S, P> {
	new (props: P): {};
}

// declare class RoduxConnection<S, P> extends Roact.Component<S, P> {
// 	constructor(props: P);
// 	public render(): Roact.Element;
// }

interface Connector {
	(): RoactRoduxWrapper<any, any>;

	/**
	 * Expression 2
	 */
	<S, P>(
		mapStateToProps: (() => MapStateToProps<S, P, keyof S>),
		mapDispatchToProps?: MapDispatcherToProps<P>,
	): RoactRoduxWrapper<S, P>;

	<P>(
		mapStateToProps: undefined,
		dispatcher?: MapDispatcherToProps<P>,
	): RoactRoduxWrapper<{}, P>;

	/**
	 * Signature 3
	 */
	<S, P>(
		mapStateToProps: MapStateToProps<S, P, keyof S>,
		mapDispatchToProps?: MapDispatcherToProps<P>,
	): RoactRoduxWrapper<S, P>;
}

type MapStateToProps<S, P, K extends keyof S> = (
	state: S,
	props: P,
) => ContainsKeys<S, K>;

declare namespace RoactRodux {
	class StoreProvider extends Roact.Component<{}, StoreProviderProps> {
		public render(): Roact.Element;
	}

	const connect: Connector;

	// function connect<COM extends Roact.Component<S, P>, S, P>(
	// 	mapStateToProps: MapStateToProps<S, P, keyof S>,
	// 	dispatcher: Dispatcher,
	// ): Connector<S, P>;
}
