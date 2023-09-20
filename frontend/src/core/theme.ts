let _theme: Theme;

export class Theme {
  static getInstance() {
    console.assert(_theme != null, "Theme Not Implemented");
    return _theme;
  }

  static setInstance(theme: Theme) {
    _theme = theme;
  }
}
