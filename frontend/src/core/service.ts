import { Constructor } from "./mixin";
const _services = new Map<Object, Object>();

export function registerService<T extends Service>(
  type: Object,
  impl: Constructor<T>
) {
  _services.set(type, createService<T>(impl));
}

export function ServiceGetter<T>(type: Object) {
  return function (
    target: any,
    propertyKey: string,
    descriptor?: PropertyDescriptor
  ) {
    target[propertyKey] = new Proxy(target, {
      get(target: T, prop, receiver) {
        const service = _services.get(type);
        return service[prop];
      },
    });
  };
}

export function getService<T extends Service>(type: Object): T {
  return _services.get(type) as T;
}

export abstract class Service {}

export function createService<T extends Service>(ctor: Constructor<T>): T {
  return new ctor() as T;
}
