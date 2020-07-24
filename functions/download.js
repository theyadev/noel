const Path = require("path");
const fs = require('fs')
const axios = require('axios')

module.exports.download = async function download(url, name) {
  const path = Path.resolve(__dirname, "../themes", name);
  if (!fs.existsSync(path)) {
    const writer = fs.createWriteStream(path);

    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }
};
