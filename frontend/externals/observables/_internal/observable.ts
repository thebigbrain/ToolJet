export type Observer<T = void> = (value?: T) => void;

export abstract class AbstractObservable {}

export class Subscription {
  constructor(private dispose: () => void) {}

  unsubscribe() {
    this.dispose();
  }
}

export class Observable<T> extends AbstractObservable {
  _value: T;
  _listeners: Map<Observer<T>, boolean> = new Map();

  get value() {
    return this._value;
  }

  set value(value: T) {
    if (this._value == value) return;
    this._value = value;
    this.notify();
  }

  update(value?: Partial<T>) {
    if (value != null) this.value = { ...this.value, ...value };
  }

  constructor(value: T) {
    super();
    this._value = value;
  }

  subscribe(o: Observer<T>): Subscription {
    this._listeners.set(o, true);

    return new Subscription(() => {
      this.detach(o);
    });
  }

  attach(o: Observer<T>): void {
    this._listeners.set(o, true);
  }

  detach(o: Observer<T>): void {
    this._listeners.delete(o);
  }

  notify(): void {
    for (let cb of this._listeners.keys()) {
      cb(this.value);
    }
  }
}

export function createObservable<T>(value?: T): Observable<T> {
  return new Observable(value);
}

export function notify<T>(o: Observable<T>, value: T) {
  o.value = value;
}
