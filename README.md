# Koia

A scalable discord.js command framework that supports both text-based and slash commands.

## Overview

Koia splits up groups of commands and listeners into **plugins**. They can be unloaded and loaded as required and has many features to make bot creation easy.

## Examples

Typescript:

```ts
import { Client, Plugin } from 'koia';

// Register a plugin.
const utility = new Plugin({
  name: 'utility',
  onLoad: () => console.log('Loaded utility plugin!')
});

// Register a text-based command.
utility.command({
  name: 'ping',
  run: ({ message }) => {
    return message.channel.send('Pong!');
  }
});

const client = new Client({
  // intents, plugins, and prefix are the required options.
  intents: ['GUILDS', 'GUILD_MESSAGES'],
  plugins: [utility],
  prefix: '!'
});

// Connect and startup the bot.
client.connect();
```

JavaScript:

```js
const { Client, Plugin } = require('koia');

const utility = new Plugin({
  name: 'utility',
  onLoad: () => console.log('Loaded utility plugin!')
});

// Register a slash command.
utility.slashCommand({
  name: 'ping',
  description: 'Pings the bot.',
  options: [],

  run: ({ interaction }) => {
    return interaction.reply('Pong!');
  }
});

const client = new Client({
  // intents, plugins, and prefix are the required options.
  intents: ['GUILDS', 'GUILD_MESSAGES'],
  plugins: [utility],
  prefix: '!'
});

client.login("YOUR TOKEN PREFIX");
```
