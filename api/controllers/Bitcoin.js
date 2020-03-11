const fetch = require('node-fetch');

const BitcoinModel = require('../models/Bitcoin');

const api = {
    apiBase: 'https://api.blockcypher.com',
    apiAccountInfo: '/v1/btc/main/addrs/{{address}}/balance',
    apiTransactionInfo: ''
};

//TODO Function to update wallet detail per address , keep address and add last updated throw wrong address
exports.updateAddressBalance = async(address) => {
    // TODO request to get data from api on address
    // TODO validate response
    // TODO set lastUpdated
    // TODO request to write new balances into file
    try {
        const url = api.apiBase + api.apiAccountInfo.replace("{{address}}", address);
        const apiResponse = await fetch(url);
        if (apiResponse.status === 404) throw 'Invalid address';
        const apiData = await apiResponse.json();
        apiData.lastUpdated = new Date(Date.now()).toString();
        // TODO write apiData to file to correct type
        return apiData

    } catch (err) {
        return { errmessage: err };
    }
}