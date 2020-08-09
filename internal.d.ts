import { Dispatch, Action, AnyAction } from "@rbxts/rodux";
/// <reference path="index.d.ts" />

interface StatefulComponent<P> extends Roact.RenderablePropsClass<P> {}
interface FunctionalComponent<P> {
	(props: P): Roact.Element | undefined;
}

type ComponentType<P = {}> = StatefulComponent<P> | FunctionalComponent<P>;

type Shared<InjectedProps, DecorationTargetProps> = {
	[P in Extract<
		keyof InjectedProps,
		keyof DecorationTargetProps
	>]?: InjectedProps[P] extends DecorationTargetProps[P]
		? DecorationTargetProps[P]
		: never
};

type Matching<InjectedProps, DecorationTargetProps> = {
	[P in keyof DecorationTargetProps]: P extends keyof InjectedProps
		? InjectedProps[P] extends DecorationTargetProps[P]
			? DecorationTargetProps[P]
			: InjectedProps[P]
		: DecorationTargetProps[P]
};

type ConnectedComponentClass<C extends ComponentType<any>, P> = Roact.Component<
	P
> & {
	new (props: P): Roact.Component<P>;
};

// Infers prop type from component C
type GetProps<C> = C extends ComponentType<infer P> ? P : never;

type InferableComponentEnhancerWithProps<TInjectedProps, TNeedsProps> = <
	C extends ComponentType<Matching<TInjectedProps, GetProps<C>>>
>(
	component: C,
) => ConnectedComponentClass<
	C,
	Omit<GetProps<C>, keyof Shared<TInjectedProps, GetProps<C>>> & TNeedsProps
>;

interface DispatchProp<A extends Action = AnyAction> {
	dispatch: Dispatch<A>;
}

type MapStateToProps<TStateProps, TOwnProps, State> = (
	state: State,
	props: TOwnProps,
) => TStateProps;

type RoactRoduxEnhancerWithProps<TInjectedProps, TNeedsProps> = <
	C extends ComponentType<Matching<TInjectedProps, GetProps<C>>>
>(
	component: C,
) => ConnectedComponentClass<
	C,
	Omit<GetProps<C>, keyof Shared<TInjectedProps, GetProps<C>>> // & TNeedsProps
>;

type RoactRoduxEnhancer<TInjectedProps> = RoactRoduxEnhancerWithProps<
	TInjectedProps,
	{}
>;

type MapDispatchToPropsFunction<TDispatchProps, TOwnProps> = (
	dispatch: Dispatch<Action>,
	ownProps: TOwnProps,
) => TDispatchProps;

type MapStateToPropsFactory<TStateProps, TOwnProps, State> = (
	initialState: State,
	ownProps: TOwnProps,
) => MapStateToProps<TStateProps, TOwnProps, State>;

type MapDispatcherToPropsFactory<TDispatchProps, TOwnProps> = (
	dispatch: Dispatch<Action>,
) => MapDispatchToPropsFunction<TDispatchProps, TOwnProps>;

type MapStateToPropsParam<TStateProps, TOwnProps, State> =
	| MapStateToPropsFactory<TStateProps, TOwnProps, State>
	| MapStateToProps<TStateProps, TOwnProps, State>
	| undefined;

type MapDispatchToPropsFactory<TDispatchProps, TOwnProps> = (
	dispatch: Dispatch<Action>,
	ownProps: TOwnProps,
) => MapDispatchToPropsFunction<TDispatchProps, TOwnProps>;

type MapDispatchToPropsNonObject<TDispatchProps, TOwnProps> =
	| MapDispatchToPropsFactory<TDispatchProps, TOwnProps>
	| MapDispatchToPropsFunction<TDispatchProps, TOwnProps>;

export type InferThunkActionCreatorType<
	TActionCreator extends (...args: any[]) => any
> = TActionCreator extends (
	...args: infer TParams
) => (...args: any[]) => infer TReturn
	? (...args: TParams) => TReturn
	: TActionCreator;

type HandleThunkActionCreator<TActionCreator> = TActionCreator extends (
	...args: any[]
) => any
	? InferThunkActionCreatorType<TActionCreator>
	: TActionCreator;

type ResolveThunks<TDispatchProps> = TDispatchProps extends {
	[key: string]: any;
}
	? {
			[C in keyof TDispatchProps]: HandleThunkActionCreator<
				TDispatchProps[C]
			>
	  }
	: TDispatchProps;
