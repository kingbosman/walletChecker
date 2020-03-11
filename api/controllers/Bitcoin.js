const fetch = require('node-fetch');

const BitcoinModel = require('../models/Bitcoin');

const response = {
    error: true,
    message: ''
};

//TODO Function to update wallet detail per address , keep address and add last updated throw wrong address
exports.updateAddressBalance = async(address) => {
    // TODO retrieve address from model
    // TODO request to get data from api on address
    // TODO validate response
    // TODO request to write new balances into file
    // TODO set lastUpdated
    // TODO set routes
    try {
        // get data from model
        // Call model by address
        throw 'this'
        return response;
    } catch (err) {
        response.message = err;
        return response;
    }
}