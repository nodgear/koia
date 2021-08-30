import { ClientEvents } from 'discord.js';
import { TextCommandOptions, SlashCommandOptions, ListenerOptions, PluginOptions } from '../../util/types';

/**
 * The guild plugin class.
 * @example
 * ```ts
 * import { GuildPlugin } from 'koia';
 *
 * // Export this to register commands in other files.
 * export const utilityPlugin = new GuildPlugin({
 *   name: 'utility',
 *   description: 'A plugin for bot utilities.'
 * });
 *
 * utilityPlugin.command({
 *  name: 'ping',
 *  description: 'Pings the bot.',
 *
 *  run: ({ message }) => {
 *    message.channel.send('pong!');
 *  }
 * });
 *
 * utilityPlugin.listener({
 *  name: 'ready',
 *  once: true,
 *
 *  run: ({ client }) => {
 *    console.log(`Logged in as ${client.user!.tag}!`);
 *  }
 * });
 * ```
 */
export class Plugin {
  public commands = new Map<string, TextCommandOptions>();
  public slashCommands = new Map<string, SlashCommandOptions>();
  public listeners = new Map<string, ListenerOptions<any>>();

  constructor(public options: PluginOptions) {}

  /**
   * Adds a text-based command to the plugin.
   * @param options The options for the command.
   */
  public command(options: TextCommandOptions) {
    if (options.aliases)
      for (var i = 0; i !== options.aliases.length; ++i) this.commands.set(options.aliases[i], options);
    this.commands.set(options.name, options);
  }

  /**
   * Adds a slash-based command to the plugin.
   * @param options The options for the command.
   */
  public slashCommand(options: SlashCommandOptions) {
    this.slashCommands.set(options.name, options);
  }

  /**
   * Adds an event command to the plugin.
   * @param options The options for the command.
   */
  public listener<T extends keyof ClientEvents>(options: ListenerOptions<T>) {
    this.listeners.set(options.name, options);
  }
}
