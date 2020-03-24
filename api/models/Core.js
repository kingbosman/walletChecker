// TODO scan what data and processes needs to be put to DB
// TODO convert to Mongoose model? or not because this si core

const fs = require('fs');

// TODO write to DB not file
exports.writeFile = async(content, map, fileName) => {
    const path = `./data/${map}/${fileName.toLowerCase()}.json`;
    await fs.writeFileSync(path, JSON.stringify(content));
};

// TODO get from DB not from file
exports.getCoinDetails = async(coin) => {
    const detailsFile = './data/details/{{coin}}.json';
    const file = detailsFile.replace("{{coin}}", coin.toLowerCase());
    const details = await fs.readFileSync(file);
    return JSON.parse(details);
};