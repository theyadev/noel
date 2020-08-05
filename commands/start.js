const playRandomSong = require("../functions/playRandomSong.js").playRandomSong;
const Discord = require("discord.js");

module.exports = {
  name: "start",
  execute(message, args) {
    if (message.member.voice && message.member.voice.channel) {
      if (
        global.dispatcher[message.guild.id] &&
        message.guild.voice &&
        message.guild.voice.channel
      )
        return message.reply("quiz already started.");
      if (global.onQuiz[message.guild.id] == true)
        return message.reply("please don't try to break the bot.");
      global.onQuiz[message.guild.id] = true;
      message.member.voice.channel.join().then((con) => {
        global.points[message.guild.id] = new Map();
        global.nos[message.guild.id] = 0;
        let n = 10;
        if (args) {
          args.forEach((e) => {
            if (isNaN(e)) {
              if (e.toUpperCase() == "ED") {
                global.type[message.guild.id] = "ED";
              } else if (e.toUpperCase() == "OP") {
                global.type[message.guild.id] = "OP";
              } else if (
                e.toLowerCase() == "-nonext" ||
                e.toLowerCase() == "-nn"
              ) {
                global.next[message.guild.id] = false;
              } else if (
                e.toLowerCase() == "-unlimitednext" ||
                e.toLowerCase() == "-un"
              ) {
                global.next[message.guild.id] = "unlimited";
              }
            } else if (e > 0) {
              n = e;
            }
          });
        }
        if (!global.next[message.guild.id])
          global.next[message.guild.id] = true;

        if (global.next[message.guild.id] == true) {
          if (!global.nextUsers[message.guild.id])
            global.nextUsers[message.guild.id] = new Set();

          global.nextStatus[message.guild.id] = 0;
        }

        if (!global.leaveUsers[message.guild.id])
          global.leaveUsers[message.guild.id] = new Set();

          global.leaveStatus[message.guild.id] = 0;
        playRandomSong(message, con, 10);

        let type = global.type[message.guild.id];
        if (type == undefined) type = "OP/ED";

        const embed = new Discord.MessageEmbed()
          .setTitle("__A new quiz has started__")
          .setColor(5806717)
          .setDescription(
            "If you want to participate please join this voice channel: " +
              message.member.voice.channel.name
          )
          .setTimestamp(new Date())
          .addFields(
            {
              name: "Number of song:",
              value: n,
              inline: true,
            },
            {
              name: "Type of song:",
              value: type,
              inline: true,
            }
          );

        message.channel.send(embed);
      });
    } else {
      message.reply("you're not in a voice channel.");
    }
  },
};
