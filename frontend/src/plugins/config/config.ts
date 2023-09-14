import { Config } from "@/core/config";
import { IPlugin } from "@/core/plugin";
import envConfig from "config";

export async function getAppConfig(): Promise<Config> {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  const response = await fetch(`${envConfig.apiUrl}/config`, requestOptions);
  const config: Config = await response.json();
  config.API_URL = config.API_URL ?? envConfig.apiUrl;

  Config.setInstance(config);

  return config;
}

export class ConfigPlugin implements IPlugin {
  install() {}

  uninstall() {}
}

const plugin = new ConfigPlugin();

export default plugin;
