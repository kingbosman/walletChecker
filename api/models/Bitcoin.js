// TODO divide controller / model (this is controller, model is read from file and write to file only)

const fs = require('fs');

const api_url_base = 'https://api.blockcypher.com/v1/btc/main/addrs/';
const details_file = './data/details/bitcoin.json';

const default_coin = {
    name: "Bitcoin",
    attr: "BTC",
    accounts: {
        semicold: 'x',
        deepcold: 'x'
    }
};

exports.setAddress = async(type, address, overwrite = false) => {
    try {
        // BUG if file is empty (new) or non existent it returns error
        // TODO if file non existent create file with empty array
        // TODO if file is empty fill with empty array, in theory this should never occur
        let details = await this.getDetails();
        if (!details.name) details.name = default_coin.name;
        if (!details.attr) details.attr = default_coin.attr;
        if (!details.accounts) details.accounts = default_coin.accounts;

        //Check if accounts exist if not create empty array and fill it.
        // TODO add address if not set or overwrite when flag overwrite is set
        if (!details.accounts[type]) details.accounts[type] = address;

        // Check for error
        if (details.error) throw details.error;

        // Finally write file
        await fs.writeFileSync(details_file, JSON.stringify(details));
        // TODO remove next line or just return let details
        return await this.getDetails();
    } catch (err) {
        return { error: err }
    }

};

exports.getDetails = async() => {
    try {
        // get all details from BTC
        let details = await fs.readFileSync(details_file);
        details = JSON.parse(details);
        //FIXME remove and add somewhere else it iwll result in error on set address
        //  if (!details.accounts) throw 'No accounts found';
        return details;
    } catch (err) {
        return { error: err }
    }
};

exports.setDetails = async() => {
    //TODO Set details from API
};


exports.getTransactions = () => {
    //TODO Get transactions from JSON
};

exports.setTransactions = () => {
    //TODO Set transactions from API
};