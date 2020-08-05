const { prefix } = require("../config.json");

module.exports = {
  name: "next",
  execute(message) {
    if (global.next[message.guild.id] == false)
      return message.reply("next are not allowed for this game.");
    if (global.dispatcher && global.dispatcher[message.guild.id]) {
      if (global.next[message.guild.id] == "unlimited")
        global.dispatcher[message.guild.id].emit("finish");
      else {
        if (global.nextUsers[message.guild.id].has(message.author.id))
          return message.reply("You already voted next.");
        global.nextUsers[message.guild.id].add(message.author.id);
        global.nextStatus[message.guild.id]++;
        const n =
          message.member.voice.channel.members.size - 1 == 2
            ? 3
            : message.member.voice.channel.members.size;
        const x = Math.round(n / 2);
        if (global.nextStatus[message.guild.id] >= x) {
          global.nextUsers[message.guild.id].clear();
          global.nextStatus[message.guild.id] == 0;
          global.dispatcher[message.guild.id].emit("finish");
        } else {
          message.channel.send(
            `Current "next" vote status: ${global.nextStatus[message.guild.id]} / ${x}... Waiting for other player to do "${prefix}next" `
          );
        }
      }
    }
  },
};
