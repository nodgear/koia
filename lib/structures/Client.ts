import * as lexure from 'lexure';
import Discord from 'discord.js';
import { Plugin } from './plugins/Plugin';
import { PluginManager } from './plugins/PluginManager';
import { Args } from './args/Args';

/**
 * The client class for Koia.
 * @example
 * ```ts
 * import { Client } from 'koia';
 *
 * const client = new Client({ intents: 513, plugins: [], prefix: '!' });
 *
 * client.login(process.env.DISCORD_TOKEN!);
 * ```
 */
export class Client extends Discord.Client {
  public prefix: string;
  public plugins: Plugin[];
  public manager: PluginManager = new PluginManager(this);

  public constructor(options: KoiaOptions) {
    super(options);
    this.plugins = options.plugins;
    this.prefix = options.prefix;
  }

  /**
   * Sets up all the commands and events, then logs into Discord.
   * @param token The bot token to login with.
   */
  public async login(token: string) {
    // Load all the plugins and their managers.
    await this.#load();
    // Return the d.js login function and upsert slash commands.
    return super.login(token).then(() => {
      const plugins = [...this.manager.plugins.values()];

      for (var i = 0; i !== plugins.length; ++i) {
        const slashes = [...plugins[i].slashCommands.values()];
        const payload = [];

        for (var j = 0; j !== slashes.length; ++j) {
          const slash = slashes[i];
          const options: Discord.ApplicationCommandData = {
            name: slash.name,
            description: slash.description,
            options: slash.options
          };

          payload.push(options);
        }

        this.application!.commands.set(payload);
      }

      // Meet the return type.
      return '';
    });
  }

  /**
   * Private method to load all plugins.
   */
  async #load() {
    const plugins = [...this.manager.loadAll().values()];

    for (var i = 0; i !== plugins.length; ++i) {
      const plugin = plugins[i];
      // Text-based command handling.
      this.on('messageCreate', async message => {
        if (!message.guild || message.author.bot) return;
        if (message.member!.partial) await message.member!.fetch();

        const args = new Args(message, this).parse();
        if (!args) return;

        const command = plugin.commands.get(args.trigger);
        if (!command) return;

        if (command.permissions) if (!message.member!.permissions.has([...command.permissions])) return;

        const commandArgs = args.args ? new lexure.Args(args.args) : null;
        await command.run({ message, args: commandArgs, client: this });
      });

      // Slash command handling.
      this.on('interactionCreate', async interaction => {
        if (!interaction.isCommand() || !interaction.guild) return;
        const i = interaction as Discord.CommandInteraction;

        const command = plugin.slashCommands.get(i.commandName);
        if (!command) return i.reply({ content: "This command doesn't exist.", ephemeral: true });

        await command.run({ interaction: i, client: this });
      });

      // Event handling.
      const events = [...plugin.listeners.values()];
      for (var j = 0; j !== events.length; ++j)
        this[events[i].type](
          events[i].name,
          async (...args) => void (await events[i].run({ meta: args, client: this }))
        );
    }
  }
}

export type KoiaOptions = Discord.ClientOptions & { plugins: Plugin[]; prefix: string };
