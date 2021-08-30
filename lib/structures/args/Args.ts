import * as lexure from 'lexure';
import { Message } from 'discord.js';
import { Client } from '../Client';

export class Args {
  #lexer: lexure.Lexer;
  #parser: lexure.Parser;

  constructor(message: Message, protected client: Client) {
    this.#lexer = new lexure.Lexer(message.content).setQuotes([
      ['"', '"'],
      ["'", "'"],
      ['’', '’'],
      ['‚', '‛'],
      ['“', '”'],
      ['„', '‟'],
      ['「', '」'],
      ['『', '』'],
      ['〝', '〞'],
      ['﹁', '﹂'],
      ['﹃', '﹄'],
      ['＂', '＂'],
      ['｢', '｣'],
      ['«', '»'],
      ['《', '》'],
      ['〈', '〉']
    ]);
    this.#parser = new lexure.Parser();
  }

  /**
   * Parses the arguments and returns some helper functions.
   *
   * Returns `null` if no arguments, or an args object to use for a helper.
   */
  public parse() {
    const parsed = this.#lexer.lexCommand(s => (s.startsWith(this.client.prefix) ? 1 : null));

    if (!parsed) return null;
    const parser = this.#parser.setInput(parsed[1]()).setUnorderedStrategy(lexure.longStrategy());

    return {
      trigger: parsed[0].value,
      args: parser.parse()
    };
  }
}
