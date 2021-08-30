import { Client } from '../Client';
import { Plugin } from './Plugin';

export class PluginManager {
  public plugins: Map<string, Plugin> = new Map();

  constructor(private client: Client) {}

  /**
   * Loads all plugins and their helpers.
   */
  public loadAll() {
    for (var i = 0; i !== this.client.plugins.length; ++i) {
      const plugin = this.client.plugins[i];
      // Run the onLoad function if there is one.
      plugin.options.onLoad?.({ client: this.client });
      // Add the plugin to the map.
      this.plugins.set(plugin.options.name, plugin);
    }

    return this.plugins;
  }

  /**
   * Unload a plugin.
   * @param plugin A string or Plugin class.
   */
  public unload(plugin: string | Plugin) {
    if (plugin instanceof Plugin) {
      const resolved_plugin = this.plugins.has(plugin.options.name);
      if (!resolved_plugin) return false;

      // Run the unload function.
      plugin.options.onUnload?.({ client: this.client });

      this.plugins.delete(plugin.options.name);
      return true;
    }

    const resolved_plugin = this.plugins.get(plugin);
    if (!resolved_plugin) return false;

    // Run the unload function.
    resolved_plugin.options.onUnload?.({ client: this.client });

    this.plugins.delete(plugin);
    return true;
  }

  /**
   * Load a plugin.
   * @param plugin A plugi nclass.
   */
  public load(plugin: Plugin) {
    // Run the on-load function.
    plugin.options.onLoad?.({ client: this.client });
    // Load the plugin.
    this.plugins.set(plugin.options.name, plugin);
  }
}
