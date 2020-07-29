const Discord = require("discord.js");

module.exports = {
  name: "help",
  execute(message) {
    const embed = new Discord.MessageEmbed()
      .addFields(
        {
          name: "**'start** *(Number of songs) (OP/ED)*",
          value: "Start a new quiz",
        },
        {
          name: "**'next**",
          value: "Skip the current theme.",
        },
        {
          name: "**'leave**",
          value: "Stop the quiz.",
        },
        {
          name: "**'points**",
          value: "Show the leaderboard for the current quiz.",
        },
        {
          name: "**'set** *(Anilist username)*",
          value: "Set your anilist profile.",
        }
      )
      .setAuthor("Noel's commands list", "", "https://github.com/theyadev/noel")
      .setDescription("Here's all the commands for the bot:")
      .setTimestamp(new Date())
      .setColor(1127128);
    message.channel.send(embed);
  },
};
