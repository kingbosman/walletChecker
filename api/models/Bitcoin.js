const fs = require('fs');

const CoreModel = require('./Core');

const api = {
    apiBase: 'https://api.blockcypher.com',
    apiAccountInfo: '/v1/btc/main/addrs/{{address}}/balance',
    apiTransactionInfo: ''
};

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

exports.updateAddress = async(type, address) => {
    // Reget the details to confirm latest details are being used
    const details = await this.getDetails();
    details.accounts[type] = { address: address };
    await this.writeFile(details);
    return details.accounts[type];
};