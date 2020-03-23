const fetch = require('node-fetch');

const BitcoinModel = require('../models/Bitcoin');

const api = {
    apiBase: 'https://api.blockcypher.com',
    apiAccountInfo: '/v1/btc/main/addrs/{{address}}/balance',
    apiTransactionInfo: ''
};
const decimals = 8;

exports.updateAddressBalance = async(address, type) => {
    try {

        // Get data from API
        const newData = await this.getAddressBalance(address);
        if (newData.errmessage) throw newData.errmessage;

        // Update file with new data
        BitcoinModel.updateAddress(type, address, newData);

        // Return data retrieved from API
        return newData;

    } catch (err) {
        return { errmessage: err };
    }
}

exports.getAddressBalance = async(address) => {
    try {
        const url = api.apiBase + api.apiAccountInfo.replace("{{address}}", address);
        const apiResponse = await fetch(url);
        if (apiResponse.status === 404) throw 'Invalid address';
        const apiData = await apiResponse.json();

        // Only set this data to array
        const newData = {
            'balance': apiData.balance / Math.pow(10, decimals),
            'unconfirmed_balance': apiData.unconfirmed_balance / Math.pow(10, decimals),
            'final_balance': apiData.final_balance / Math.pow(10, decimals),
            'received': apiData.total_received / Math.pow(10, decimals),
            'sent': apiData.total_sent / Math.pow(10, decimals),
            'txs': apiData.n_tx,
            'unconfirmed_txs': apiData.unconfirmed_n_tx,
            'final_txs': apiData.final_n_tx,
            'date': new Date(Date.now()).toString()
        };

        // Check for api errors or server errors
        if (!newData.balance) {
            if (apiData.error) throw apiData.error;
            throw 'Unknown error...';
        }

        // Finally return data
        return newData;
    } catch (err) {
        return { errmessage: err };
    }
}