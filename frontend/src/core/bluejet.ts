import { Config } from "./config";
import { Theme } from "./theme";

export abstract class Bluejet {
  static _instance: Bluejet = null;

  static getInstance(): Bluejet {
    console.assert(this._instance != null, "Bluejet Not Implemented!");
    return this._instance;
  }

  static setInstance(jet: Bluejet) {
    this._instance = jet;
  }

  abstract restart(): void;
  abstract prepare(): Promise<void>;

  getConfig(): Config {
    return Config.getInstance();
  }

  getTheme(): Theme {
    return Theme.getInstance();
  }
}
