import React, {
  ComponentType,
  createElement,
  useEffect,
  useState,
} from "react";
import { Observable, Observer } from "./_internal/observable";

type ObservablesReturnType<P extends Object> = (
  Comp: ComponentType<P>
) => ComponentType<P>;

export function observables<P = {}>(
  ...subjects: Array<Observable<any>>
): ObservablesReturnType<P> {
  return (WrappedComponent: ComponentType<P>) => (props: P) => {
    let [refreshCounter, setRefreshCounter] = useState(0);

    useEffect(() => {
      const observer: Observer<number> = () => {
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

    return createElement(WrappedComponent, props);
  };
}
