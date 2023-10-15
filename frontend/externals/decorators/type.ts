import "reflect-metadata";

// Design-time type annotations
export function Type(type) {
  return Reflect.metadata("design:type", type);
}
export function ParamTypes(...types) {
  return Reflect.metadata("design:paramtypes", types);
}
export function ReturnType(type) {
  return Reflect.metadata("design:returntype", type);
}
