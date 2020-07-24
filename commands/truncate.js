const Path = require("path");
const empty = require("empty-folder");

module.exports = {
  name: "truncate",
  execute(message, args) {
    if (message.author.id == "382302674164514818") {
      const path = Path.resolve(__dirname, "../themes");
      empty(path, false, (o) => {
        if (o.error) console.error(o.error)
        console.log(o.removed);
        message.channel.send("Themes Folder Truncated.");
      });
    } else {
      message.reply("only Theya can do this.");
    }
  },
};
