const Discord = require("discord.js");
const getPoints = require("../functions/points").points;

module.exports = {
  name: "points",
  execute(message, args) {
    if (global.dispatcher == undefined)
      return message.reply("no quiz ongoing.");

    if (global.points.size != 0) {
      getPoints(message);
    } else {
      message.reply("nobody has points.");
    }
  },
};
