import React, {
  ComponentClass,
  FunctionComponent,
  PropsWithChildren,
  createElement,
  useEffect,
  useState,
} from "react";
import {
  AbstractObservable,
  Observable,
  Observer,
} from "./_internal/observable";

export function observables<P>(
  ...subjects: Array<Observable<AbstractObservable>>
) {
  return function <T extends FunctionComponent | ComponentClass>(Comp: T) {
    const Wrapped = (props: P) => {
      let [refreshCounter, setRefreshCounter] = useState(0);

      useEffect(() => {
        const observer: Observer<any> = () => {
          refreshCounter++;
          setRefreshCounter(refreshCounter);
        };

        subjects.forEach((s) => {
          s.attach(observer);
          return s;
        });

        return () => {
          subjects.forEach((s) => s.detach(observer));
        };
      }, []);

      return createElement(Comp, props, (props as PropsWithChildren).children);
    };

    return Wrapped as unknown as T;
  };
}

export const auto = observables;
