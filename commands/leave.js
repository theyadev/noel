const { prefix } = require("../config.json");

module.exports = {
  name: "leave",
  execute(message) {
    if (message.guild.voice && message.guild.voice.channel) {
      if (global.dispatcher && global.dispatcher[message.guild.id]) {
        if (global.leaveUsers[message.guild.id].has(message.author.id))
          return message.reply("You already voted leave.");
        global.leaveUsers[message.guild.id].add(message.author.id);
        global.leaveStatus[message.guild.id]++;
        const n =
          message.member.voice.channel.members.size - 1 == 2
            ? 3
            : message.member.voice.channel.members.size;
        const x = Math.round(n / 2);
        if (global.leaveStatus[message.guild.id] >= x) {       
          global.leaveUsers[message.guild.id].clear();
          global.leaveStatus[message.guild.id] == 0;
          global.leave[message.guild.id] = 1;
          message.guild.voice.channel.leave();
          global.dispatcher[message.guild.id].emit("finish");
          global.dispatcher[message.guild.id] = undefined;
        } else {
          message.channel.send(
            `Current "leave" vote status: ${
              global.leaveStatus[message.guild.id]
            } / ${x}... Waiting for other player to do "${prefix}leave" `
          );
        }
      }
    } else {
      message.reply("I'm not in a voice channel.");
    }
  },
};
