module.exports = {
  name: "leave",
  execute(message, args) {
    if (message.guild.voice && message.guild.voice.channel) {
      message.guild.voice.channel.leave();
      if (global.dispatcher) {
        global.leave = 1;
        global.dispatcher.emit("finish");
        global.dispatcher = undefined;
      }
    } else {
      message.reply("I'm not in a voice channel.");
    }
  },
};
