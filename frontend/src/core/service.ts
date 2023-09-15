const _services = new Map();

export function registerService(name, service) {
  _services.set(name, service);
}

export function getService(name) {
  return _services.get(name);
}

export class ServiceType {
  static Application = 'Application';
}
