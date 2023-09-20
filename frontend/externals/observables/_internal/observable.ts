export type Observer<T> = (value: T) => void;

export class Observable<T> {
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

  constructor(value: T) {
    this._value = value;
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

export function createObservable<T>(value: T): Observable<T> {
  return new Observable(value);
}

export function notify<T>(o: Observable<T>, value: T) {
  o.value = value;
}
