module.exports = {
  name: "next",
  execute(message) {
    if (global.dispatcher && global.dispatcher[message.guild.id]) {
      global.dispatcher[message.guild.id].emit("finish");
    }
  },
};
