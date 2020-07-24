module.exports = {
  name: "next",
  execute(message, args) {
    if (global.dispatcher) {
      global.dispatcher.emit("finish");
    }
  },
};
