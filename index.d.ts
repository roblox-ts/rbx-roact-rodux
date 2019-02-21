import Roact = require("rbx-roact");

export as namespace RoactRodux;
export = RoactRodux;

interface StoreProviderProps {
	store: Rodux.Store<unknown>;
}

type ContainsKeys<S, K extends keyof S> = Pick<S, K> | S | undefined;
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

type MapStateToProps<S, P, K extends keyof S> = (
	state: S,
	props: P,
) => Partial<P>;

declare namespace RoactRodux {

	type Mapped<P> = Partial<P>;

	class StoreProvider extends Roact.Component<StoreProviderProps> {
		public render(): Roact.Element;
	}

	function connect(): RoactRoduxWrapper<{}, {}>;

	function connect<S, P>(
		mapStateToProps: (() => MapStateToProps<S, P, keyof S>),
		mapDispatchToProps?: MapDispatcherToProps<P>,
	): RoactRoduxWrapper<S, P>;

	function connect<P>(
		mapStateToProps: undefined,
		dispatcher?: MapDispatcherToProps<P>,
	): RoactRoduxWrapper<{}, P>;

	function connect<S, P>(
		mapStateToProps: MapStateToProps<S, P, keyof S>,
		mapDispatchToProps?: MapDispatcherToProps<P>,
	): RoactRoduxWrapper<S, P>;
}
