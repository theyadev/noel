const Discord = require("discord.js");
const { prefix, token, tokenTest } = require("./config.json");
const fs = require("fs");
const Path = require("path");
const empty = require("empty-folder");
const { globalAgent } = require("http");

global.points = [];
global.dispatcher = [];
global.nos = [];
global.type = [];
global.leave = [];
global.onQuiz = []
global.next = []
global.nextStatus = []
global.nextUsers = []
global.leaveStatus = []
global.leaveUsers = []

const client = new Discord.Client();
global.client = client;
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

client.login(token);

process.stdin.resume();

process.on("SIGINT", function () {
  const path = Path.resolve(__dirname, "themes");
  empty(path, false, (o) => {
    if (o.error) throw o.error;
    process.exit();
  });
});
