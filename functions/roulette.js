const axios = require("axios");
var mysql = require("mysql");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
const db_config = {
  host: "localhost",
  user: "theya",
  password: "Mot2Passe!",
  database: "osubot",
  multipleStatements: true,
};
var connection;

async function getUserAnilist(user, callback) {
  console.log(user);
  let userAnilist;
  userAnilist = cache.get(user);
  if (userAnilist == undefined) {
    await axios.get("https://themes.moe/api/anilist/" + user).then((res) => {
      cache.set(user, res.data, 1800);
      userAnilist = res.data;
    });
  }

  callback(userAnilist);
}

module.exports.roulette = async function roulette(message, callback) {
  let ids = [];
  let Vc = message.guild.voice.channel.members;
  for (var [id, i] of Vc) {
    if (i.user.bot != true) ids.push(id);
  }
  let sql = "";
  ids.forEach((id) => {
    sql += "Select anilist_username FROM amq WHERE discord_id = " + id + ";";
  });
  connection = await mysql.createConnection(db_config);
  await connection.query(sql, function (err, res, fields) {
    if (err) throw err;
    if (res.length != 0) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].length == 0) {
          res.splice(i, 1);
        }
      }
      if (res[0][0]) {
        let user =
          res[Math.floor(Math.random() * res.length)][0].anilist_username;
        getUserAnilist(user, function (data) {
          let animes = data;
          if (global.type) {
            animes = animes.filter((e) =>
              e.themes.some((i) => i.themeType.includes(type))
            );
          }
          let randomFromAnilist =
            animes[Math.floor(Math.random() * animes.length)];
          callback(randomFromAnilist);
        });
      } else {
        let user = res[Math.floor(Math.random() * res.length)].anilist_username;
        getUserAnilist(user, function (data) {
          let animes = data;
          if (global.type) {
            animes = animes.filter((e) =>
              e.themes.some((i) => i.themeType.includes(type))
            );
          }
          let randomFromAnilist =
            animes[Math.floor(Math.random() * animes.length)];
          callback(randomFromAnilist);
        });
      }
    } else {
      getUserAnilist("TheWindSpring", function (data) {
        let animes = data;
        if (global.type) {
          animes = animes.filter((e) =>
            e.themes.some((i) => i.themeType.includes(type))
          );
        }
        let randomFromAnilist =
          animes[Math.floor(Math.random() * animes.length)];
        callback(randomFromAnilist);
      });
    }
    connection.end()
  });
};
