export type Constructor<T = {}> = new (...a: any[]) => T;

export type ConstructorOf<T extends Object, Args extends any[]> = {
  prototype: T;
  new (...args: Args): T;
};
