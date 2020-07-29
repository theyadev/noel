module.exports = {
  name: "leave",
  execute(message) {
    if (message.guild.voice && message.guild.voice.channel) {
      message.guild.voice.channel.leave();
      if (global.dispatcher && global.dispatcher[message.guild.id]) {
        global.leave[message.guild.id] = 1;
        global.dispatcher[message.guild.id].emit("finish");
        global.dispatcher[message.guild.id] = undefined;
      }
    } else {
      message.reply("I'm not in a voice channel.");
    }
  },
};
