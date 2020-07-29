const Discord = require("discord.js");

module.exports.points = function points(message) {
  const mapSort1 = new Map(
    [...global.points[message.guild.id].entries()].sort((a, b) => b[1] - a[1])
  );
  let i = 0;
  let embed = new Discord.MessageEmbed()
    .setTitle("__**Leaderboard**__")
    .setDescription(`(${global.nos[message.guild.id]} Songs Played)`);
  mapSort1.forEach((value, key) => {
    i++;
    if (i == 1) {
      embed.setThumbnail(global.client.users.cache.get(key).avatarURL());
      if (message.guild.members.cache.get(key).roles.color) {
        embed.setColor(
          message.guild.members.cache.get(key).roles.color.hexColor
        );
      } else {
        embed.setColor(15844367);
      }
    }
    let val = `${value} Points.`;
    if (value == global.nos[message.guild.id]) {
      val = val.concat(" 🔥");
    }
    embed.addFields({
      name: `#${i} ▸ ${client.users.cache.get(key).username}`,
      value: val,
    });
  });
  message.channel.send(embed);
};
