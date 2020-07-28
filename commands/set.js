var mysql = require("mysql");
const fetch = require("node-fetch");
const { db_config } = require("../config.json");
var connection;

module.exports = {
  name: "set",
  execute(message, args) {
    if (!args) {
      return message.reply("please specify your username.");
    }
    var query = `
    query ($name: String) {
      User (name: $name) { 
        id
        name
      }
    }
    `;
    var variables = {
      name: args[0],
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

    function handleData(data) {
      connection = mysql.createConnection(db_config);
      connection.query(
        `SELECT * FROM amq WHERE discord_id = "${message.author.id}"`,
        function (err, res, fields) {
          if (res.length == 0) {
            connection.query(
              `INSERT INTO amq (anilist_username, id, discord_id) VALUES ("${data.data.User.name}", "${data.data.User.id}", "${message.author.id}")`,
              function (err, res, fields) {
                message.reply(
                  "your Anilist username is now set to: " + data.data.User.name
                );
                connection.end();
              }
            );
          } else {
            connection.query(
              `UPDATE amq SET anilist_username = "${data.data.User.name}", id = "${data.data.User.id}" WHERE discord_id = "${message.author.id}"`,
              function (err, res, fields) {
                message.reply(
                  "your anilist username is now changed to: " +
                    data.data.User.name
                );
                connection.end();
              }
            );
          }
        }
      );
    }

    function handleError(error) {
      message.reply("username not found.");
      console.error(error);
    }
  },
};
