const plugins = new Map<Object, IPlugin>();

export interface IPlugin {
  install();
  uninstall();
}

export function installPlugin(plugin: IPlugin) {
  plugin.install();
  plugins.set(typeof plugin, plugin);
}

export function uninstallPlugin(plugin: IPlugin) {
  plugin.uninstall();
}

export function getPlugin<T extends IPlugin>(pluginType: Object): T {
  return plugins.get(pluginType) as T;
}
