export abstract class PresentationModel<T = {}> {
  constructor(props?: T) {}

  call(props: T): T {
    return props;
  }
  dispose() {}
  notify() {}
}
