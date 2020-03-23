const fs = require('fs');

const CoreModel = require('./Core');

const coin = {
    name: "Bitcoin",
    symbol: "BTC",
    accounts: {}
};

exports.writeFile = async(content = coin, map = 'details') => {
    CoreModel.writeFile(content, map, coin.name);
};

exports.getDetails = async() => {
    return CoreModel.getCoinDetails(coin.name);
};

exports.updateAddress = async(type, address, content = false) => {
    // Reget the details to confirm latest details are being used
    const details = await this.getDetails();
    if (!content) details.accounts[type] = { address: address };
    if (content) details.accounts[type] = { address: address, data: content };
    await this.writeFile(details);
    return details.accounts[type];
};