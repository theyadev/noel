const fetch = require("node-fetch");
const download = require("./download.js").download;
const roulette = require("./roulette.js").roulette;

module.exports.getRandomSong = async function getRandomSong(message, callback) {
  roulette(message, function (data) {
    if (global.type && global.type[message.guild.id]) {
      data.themes = data.themes.filter((e) =>
        e.themeType.includes(global.type[message.guild.id])
      );
    }
    let w = Math.floor(Math.random() * data.themes.length);
    let name = data.themes[w].mirror.mirrorURL.slice(
      "https://animethemes.moe/video/".length
    );
    download(data.themes[w].mirror.mirrorURL, name).then(() => {
      var query = `
        query ($title: String, $year: Int) {
          Media(search: $title, type: ANIME, seasonYear: $year) {
            title {
              romaji
              english
            }
            synonyms
            season
            seasonYear
            coverImage {
              extraLarge
              color
            }
            bannerImage
            genres
            tags {
              name
            }
            siteUrl
            episodes
            status
          }
        }        
`;
      var variables = {
        title: data.name,
        year: data.year,
      };

      var url = "https://graphql.anilist.co",
        options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: query,
            variables: variables,
          }),
        };

      // Make the HTTP Api request
      fetch(url, options)
        .then(handleResponse)
        .then(handleData)
        .catch(handleError);

      function handleResponse(response) {
        return response.json().then(function (json) {
          return response.ok ? json : Promise.reject(json);
        });
      }

      function handleData(anime) {
        callback(name, data, data.themes[w], anime.data.Media);
      }

      function handleError(error) {
        message.channel.send('An error as occured, loading a new song...')
        getRandomSong(message, function (name, data, info, anilist) {
          callback(name, data, info, anilist);
        });
        console.error(error);
      }
    });
  });
};
