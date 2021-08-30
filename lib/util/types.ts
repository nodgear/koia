import * as lexure from 'lexure';
import {
  ApplicationCommandOption,
  ClientEvents,
  CommandInteraction,
  Guild,
  Message,
  PermissionResolvable
} from 'discord.js';
import { Client } from '../structures/Client';

type Awaitable<T> = PromiseLike<T> | T;

export interface PluginOptions {
  /**
   * The name of the plugin.
   */
  name: string;

  /**
   * The description of the plugin.
   */
  description?: string;

  /**
   * On-load function.
   */
  onLoad?: (data: { client: Client }) => Awaitable<unknown>;

  /**
   * On-Unload function.
   */
  onUnload?: (data: { client: Client }) => Awaitable<unknown>;
}

export interface TextCommandOptions {
  /**
   * The name of the command.
   */
  name: string;

  /**
   * The description of the command.
   */
  description?: string;

  /**
   * Alias(es) for the command.
   */
  aliases?: string[];

  /**
   * Usage for the command.
   */
  usage?: string[];

  /**
   * Required user permission(s) to execute the command.
   */
  permissions?: PermissionResolvable[];

  /**
   * The run function for the command.
   */
  run: (data: TextCommandData) => Awaitable<unknown>;
}

export interface SlashCommandOptions {
  /**
   * The name of the command.
   */
  name: string;

  /**
   * The description of the command.
   */
  description: string;

  /**
   * Usage for the command.
   */
  usage?: string[];

  /**
   * Command options (leave as [] for no options).
   */
  options: ApplicationCommandOption[];

  /**
   * The run function for the command.
   */
  run: (data: SlashCommandData) => Awaitable<unknown>;
}

export interface ListenerOptions<T extends keyof ClientEvents> {
  /**
   * The name of the listener.
   */
  name: T;

  /**
   * Whether the listener runs once.
   */
  type: 'on' | 'once';

  /**
   * The run function for the listener.
   */
  run: (data: ListenerData<T>) => Awaitable<unknown>;
}

interface TextCommandData {
  /**
   * The message that discord.js provides.
   */
  message: Message;

  /**
   * The client from Koia.
   */
  client: Client;

  /**
   * The arguments (options) from the command.
   */
  args: lexure.Args | null;
}

interface SlashCommandData {
  /**
   * The interaction that discord.js provides.
   */
  interaction: CommandInteraction;

  /**
   * The client from Koia.
   */
  client: Client;
}

export interface ListenerData<T extends keyof ClientEvents> {
  /**
   * The event metadata.
   */
  meta: ClientEvents[T];

  /**
   * The client from Koia.
   */
  client: Client;
}
