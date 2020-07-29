const Discord = require("discord.js");
const getPoints = require("../functions/points").points;

module.exports = {
  name: "points",
  execute(message) {
    if (global.dispatcher && global.dispatcher[message.guild.id] == undefined)
      return message.reply("no quiz ongoing.");

    if (global.points && global.points[message.guild.id].size != 0) {
      getPoints(message);
    } else {
      message.reply("nobody has points.");
    }
  },
};
