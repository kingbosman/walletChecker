const fs = require('fs');

exports.writeFile = async(content, map, fileName) => {
    const path = `./data/${map}/${fileName.toLowerCase()}.json`;
    await fs.writeFileSync(path, JSON.stringify(content));
};

exports.getCoinDetails = async(coin) => {
    const detailsFile = './data/details/{{coin}}.json';
    const file = detailsFile.replace("{{coin}}", coin.toLowerCase());
    const details = await fs.readFileSync(file);
    return JSON.parse(details);
};