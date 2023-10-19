export function tenary<T>(condition: boolean, yes: T, no?: T): T {
  return condition ? yes : no;
}
