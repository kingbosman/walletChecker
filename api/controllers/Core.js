const fs = require('fs');
const fetch = require('node-fetch');
const BitcoinModel = require('../models/Bitcoin');

/**
 * @method GET /details
 * @param {string} [coin] Optional query flag to return only specific coin
 */
exports.getDetails = async(req, res) => {
    try {
        let content = await fs.readFileSync(`./data/details.json`);
        content = JSON.parse(content);
        if (req.query.coin) content = content[req.query.coin]
        return res.json(content);
    } catch (err) {
        return res.json(err);
    }
};

/**
 * @method POST /details/{type}/{coin}
 * @param type (semicold or deppcold)
 * @param coin
 * @result write to file and return written data
 */
exports.updateDetails = async(req, res) => {
    try {

        // FIXME remove next text lines used for testing
        test = BitcoinModel.setAddress('dev', 'address');
        console.log(await test);
        return res.end();

        // Get current details and manipulate the coin section
        let details = await fs.readFileSync('./data/details.json');
        details = JSON.parse(details);
        if (!details[req.params.coin]) throw 'Invalid coin';

        // Check JSON for setup
        if (!details[req.params.coin].accounts) throw 'No accounts have been set up';
        // Check JSON for the type
        if (!details[req.params.coin].accounts[req.params.type]) throw 'Account type is not known';

        // FIXME Start here -  import to BTC class
        // Address throw when not set
        const address = details[req.params.coin].accounts[req.params.type].address;
        if (!address || address == 'x') throw `Address not known for ${req.params.type}`


        // Get new details
        const url = details[req.params.coin].baseurl + address + '/balance';
        let response = await fetch(url);
        response = await response.json();

        // Overwrite old details and write to file
        details[req.params.coin].accounts[req.params.type].data = response;
        await fs.writeFileSync('./data/details.json', JSON.stringify(details));
        // FIXME end here and return for data, also create function for switching between coins

        // Insert update date after writing data
        details[req.params.coin].accounts[req.params.type].lastUpdated = new Date(Date.now()).toString();

        return res.json({
            status: 'Completed',
            data: details
        });
    } catch (err) {
        res.status(400).json({ error: err });
    }
}