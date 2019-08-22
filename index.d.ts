/// <reference path="internal.d.ts" />
import Roact from "@rbxts/roact";
import {
	Dispatch,
	Action,
	Store,
	EnhancedStore,
	AnyAction,
} from "@rbxts/rodux";
import {
	RoactRoduxEnhancer,
	DispatchProp,
	MapStateToProps,
	RoactRoduxEnhancerWithProps,
	MapDispatchToPropsNonObject,
	MapStateToPropsParam,
	ResolveThunks,
} from "./internal";

export as namespace RoactRodux;
export = RoactRodux;

interface StoreProviderProps {
	store: Rodux.Store<unknown>;
}

declare namespace RoactRodux {
	/**
	 * A component that provides a Rodux store to Roact components
	 * You can then make use of these stores through `RoactRodux.connect`
	 */
	class StoreProvider extends Roact.Component<StoreProviderProps> {
		constructor(props: StoreProviderProps);
		public render(): Roact.Element;
	}

	/**
	 * Creates a Rodux connection that can be used by Roact components
```ts
const connect = RoactRodux.connect(
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
const connect = RoactRodux.connect(
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
	function connect(): RoactRoduxEnhancer<DispatchProp>;
	function connect<
		TStateProps = {},
		no_dispatch = {},
		TOwnProps = {},
		State = {}
	>(
		this: void,
		mapStateToProps: MapStateToProps<TStateProps, TOwnProps, State>,
	): RoactRoduxEnhancerWithProps<TStateProps & DispatchProp, TOwnProps>;
	function connect<no_state = {}, TDispatchProps = {}, TOwnProps = {}>(
		this: void,
		mapStateToProps: undefined,
		mapDispatchToProps: MapDispatchToPropsNonObject<
			TDispatchProps,
			TOwnProps
		>,
	): RoactRoduxEnhancerWithProps<TDispatchProps, TOwnProps>;
	function connect<
		TStateProps = {},
		TDispatchProps = {},
		TOwnProps = {},
		State = {}
	>(
		this: void,
		mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
		mapDispatchToProps: MapDispatchToPropsNonObject<
			TDispatchProps,
			TOwnProps
		>,
	): RoactRoduxEnhancerWithProps<TStateProps & TDispatchProps, TOwnProps>;
}
