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

interface StatefulComponent<S, P> extends Roact.RenderablePropsClass<P> {}

interface FunctionalComponent<P> {
	(props: P): Roact.Element;
}

interface RoactRoduxWrapper<S, P> {
	(component: StatefulComponent<S, P>): RoduxConnection<S, P>;
	(component: FunctionalComponent<P>): RoduxConnection<{}, P>;
}

interface RoduxConnection<S, P> {
	new (props: P): {};
}

type MapStateToProps<S, P, K extends keyof S> = (
	state: S,
	props: P,
) => RoactRodux.Mapped<P>;

declare namespace RoactRodux {
	/**
	 * Mapped RoactRodux properties
	 */
	type Mapped<P> = Partial<P>;

	/**
	 * A component that provides a Rodux store to Roact components
	 * You can then make use of these stores through `RoactRodux.connect`
	 */
	class StoreProvider extends Roact.Component<StoreProviderProps> {
		public render(): Roact.Element;
	}

	/**
	 * Creates a Rodux connection that can be used by Roact components
```ts
const connect = RoactRodux.connect<IMyStoreState, IMyComponentProps>(
	(state: IMyStoreState, props: IMyComponentProps):
		RoactRodux.Mapped<IMyComponentProps> => {
			return {
				// ... the props you want to map go here
			};
		},
)
```

	Where `IMyStoreState` is the type of your Rodux store, and `IMyComponentProps` is the type of your Roact.Component's `props`

	The second argument is mapping the dispatch to your props:
```ts
const connect = RoactRodux.connect<IMyStoreState, IMyComponentProps>(
	(state: IMyStoreState, props: IMyComponentProps):
		RoactRodux.Mapped<IMyComponentProps> => {
			return {
				// ... the props you want to map go here
			};
		},
		dispatch => {
			return {
				// ... functions you want to map
				// you can use dispatch as a function to dispatch messages.
			}
		},
)
```
	 */
	function connect<S, P>(
		mapStateToProps: () => MapStateToProps<S, P, keyof S>,
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
