// TODO scan what data and processes needs to be put to DB
// TODO convert to {DB} model

const CoreModel = require('./Core');

// TODO add schema or not?

// TODO move coin details to DB
const coin = {
    name: "Bitcoin",
    symbol: "BTC",
    accounts: {}
};

// TODO move writing to DB (also only in controller maybe?)
exports.writeFile = async(content = coin, map = 'details') => {
    CoreModel.writeFile(content, map, coin.name);
};

// TODO check if still needed
exports.getDetails = async() => {
    return CoreModel.getCoinDetails(coin.name);
};

// TODO this writes to a file, check if needed
exports.updateAddress = async(type, address, content = false) => {
    // Reget the details to confirm latest details are being used
    const details = await this.getDetails();
    if (!content) details.accounts[type] = { address: address };
    if (content) details.accounts[type] = { address: address, data: content };
    await this.writeFile(details);
    return details.accounts[type];
};