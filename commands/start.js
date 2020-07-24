const playRandomSong = require('../functions/playRandomSong.js').playRandomSong;

module.exports = {
  name: "start",
  execute(message, args) {
    if (message.member.voice && message.member.voice.channel) {
      if (
        (global.dispatcher && !message.guild.voice) ||
        (global.dispatcher && message.guild.voice && !message.guild.voice.channel)
      )
        return message.reply("quiz already started on another server.");
      if (global.dispatcher && message.guild.voice && message.guild.voice.channel)
        return message.reply("quiz already started.");
      message.member.voice.channel.join().then((con) => {
        global.nos = 0;
        if (args) {
          let n = 10;
          args.forEach((e) => {
            if (isNaN(e)) {
              if (e.toUpperCase() == "ED") {
                global.type = "ED";
              } else if (e.toUpperCase() == "OP") {
                global.type = "OP";
              }
            } else if (e > 0) {
              n = e;
            }
          });
          playRandomSong(message, con, n);
        } else {
          playRandomSong(message, con, 10);
        }
        message.channel.send("A new quiz has started.");
      });
    } else {
      message.reply("you're not in a voice channel.");
    }
  },
};
