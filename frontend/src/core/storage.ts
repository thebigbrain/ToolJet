export class LocalStorageImpl implements StorageImpl {
  getItem<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key)) as T;
  }
  setItem(key: string, value: Object): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export interface StorageImpl {
  getItem<T>(key: string): T;
  setItem(key: string, value: Object): void;
}

export class JetStorage implements StorageImpl {
  static getInstance(): JetStorage {
    return _storage ?? new JetStorage();
  }

  getItem<T>(key: string): T {
    return _delegate.getItem<T>(key);
  }

  setItem(key: string, value: Object) {
    _delegate.setItem(key, value);
  }
}

export function persist<T>(key: string, value: T) {
  JetStorage.getInstance().setItem(key, value);
}

export function retrieve<T>(key: string): T {
  return JetStorage.getInstance().getItem(key);
}

const _storage: JetStorage = new JetStorage();
const _delegate = new LocalStorageImpl();
