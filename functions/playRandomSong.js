const getRandomSong = require("./getRandomSong").getRandomSong;
const fs = require("fs");
const Discord = require("discord.js");
const getPoints = require("./points").points;

module.exports.playRandomSong = async function playRandomSong(message, con, n) {
  getRandomSong(message, function (name, data, info, anilist) {
    global.dispatcher = con.play(fs.createReadStream("./themes/" + name), {
      type: "webm/opus",
    });

    let arrTitles = anilist.synonyms;

    if (anilist.title.romaji != null) {
      arrTitles.push(anilist.title.romaji);
    }
    if (anilist.title.english != null) {
      arrTitles.push(anilist.title.english);
    }
    if (data.name) {
      arrTitles.push(data.name);
    }

    arrTitles = arrTitles.filter(
      (e) => e.toLowerCase().replace(/[^a-zA-Z_0-9 ]/g, "") != ""
    );

    console.log(arrTitles);

    function found(msg) {
      if (global.points.has(msg.author.id)) {
        global.points.set(msg.author.id, global.points.get(msg.author.id) + 1);
      } else {
        global.points.set(msg.author.id, 1);
      }
      message.channel.send(`**${msg.author.username}** found the anime.`);
      global.dispatcher.emit("finish");
    }

    function listener(msg) {
      if (
        msg.channel.id == message.channel.id &&
        !msg.content.startsWith("<@")
      ) {
        if (
          arrTitles.some(
            (e) =>
              e
                .toLowerCase()
                .replace(/ /g, "")
                .replace(/[^a-zA-Z_0-9 ]/g, " ") ==
                msg.content
                  .toLowerCase()
                  .replace(/ /g, "")
                  .replace(/[^a-zA-Z_0-9 ]/g, " ") ||
              e
                .toLowerCase()
                .replace(/ /g, "")
                .replace(/[^a-zA-Z_0-9 ]/g, "") ==
                msg.content
                  .toLowerCase()
                  .replace(/ /g, "")
                  .replace(/[^a-zA-Z_0-9 ]/g, "")
          )
        ) {
          found(msg);
        }
      }
    }
    global.dispatcher.on("start", () => {
      message.client.on("message", listener);
    });

    global.dispatcher.on("finish", () => {
      global.nos++;
      let genres = [];
      genres.push(anilist.genres.map((e) => e).join(", "));
      let tags = [];
      tags.push(anilist.tags.map((e) => e.name).join(", "));
      let embed = new Discord.MessageEmbed()
        .setColor(anilist.coverImage.color)
        .setTitle(anilist.title.romaji + " (" + info.themeType + ")")
        .setURL(anilist.siteUrl)
        .setTimestamp(new Date())
        .setThumbnail(anilist.coverImage.extraLarge)
        .setImage(anilist.bannerImage)
        .addFields(
          { name: "Episodes", value: anilist.episodes, inline: true },
          { name: "Status", value: anilist.status, inline: true },
          {
            name: "Release Date",
            value: anilist.season + " " + anilist.seasonYear,
            inline: true,
          }
        );
      if (genres && genres[0].length > 0) {
        embed.addFields({ name: "Genres", value: genres[0], inline: true });
      }
      if (tags && tags[0].length > 0) {
        embed.addFields({ name: "Tags", value: tags[0], inline: true });
      }
      if (arrTitles) {
        let aliases = [...new Set(arrTitles)];
        embed.addFields({ name: "Names", value: aliases.join("\n") });
      }
      message.channel.send(`The answer was:`, embed);
      message.client.removeListener("message", listener);
      if (global.leave != 1 && global.nos < n) {
        playRandomSong(message, con, n);
      } else {
        message.channel.send("The quiz is finished.");
        getPoints(message);
        global.points.clear();
        global.dispatcher = undefined;
        global.nos = 0;
        message.guild.voice.channel.leave();
        global.leave = 0;
        global.type = undefined;
      }
    });
    global.dispatcher.on("error", () => {
      console.error;
      if (message.guild.voice && message.guild.voice.channel)
        message.guild.voice.channel.leave();
      if (global.dispatcher) {
        global.leave = 1;
        global.dispatcher.emit("finish");
        global.dispatcher = undefined;
      }
      message.channel.send("Error, check console.");
    });
  });
};
