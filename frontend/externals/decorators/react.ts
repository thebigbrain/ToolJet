import React, {
  Component,
  ComponentClass,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PresentationModel } from "./_internal/models";

const noop = () => {};

type ModelConstructor = { new (...args: any[]): PresentationModel };

function attachModel<P>(modelCls: ModelConstructor) {
  return function <T extends FunctionComponent | ComponentClass>(Comp: T) {
    const Wrapped: FunctionComponent = (props: P) => {
      const [, setValue] = useState({});
      const model = useMemo(() => new modelCls(props), []);

      useEffect(() => {
        const notify = model.notify;

        model.notify = () => {
          notify();
          setValue({});
        };

        return () => {
          model.notify = notify;
          model.dispose();
        };
      }, []);

      return React.createElement(
        Comp,
        model.call(props),
        (props as PropsWithChildren).children
      );
    };

    return Wrapped as unknown as T;
  };
}

export function ClassFC<P, S = {}>(
  comp: FunctionComponent<P>
): ComponentClass<P, S> {
  return class extends Component<P, S> {
    render() {
      const props: P = this.props;
      return React.createElement<P>(
        comp,
        props,
        (props as PropsWithChildren).children
      );
    }
  };
}

export function bindViewModel<T extends FunctionComponent | ComponentClass>(
  Comp: T,
  modelCls: ModelConstructor
) {
  return attachModel(modelCls)(Comp);
}
