const fs = require('fs');
const fetch = require('node-fetch');


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

exports.updateDetails = async(req, res) => {
    try {

        // Get current details and manipulate the coin section
        let details = await fs.readFileSync('./data/details.json');
        details = JSON.parse(details);
        if (!details[req.params.coin]) throw 'Invalid coin';

        // Check JSON for setup
        if (!details[req.params.coin].accounts) throw 'No accounts have been set up';
        // Check JSON for the type
        if (!details[req.params.coin].accounts[req.params.type]) throw 'Account type is not known';

        // Address throw when not set
        const address = details[req.params.coin].accounts[req.params.type].address;
        if (!address) throw `Address not known for ${req.params.type}`

        // Get new details
        const url = details[req.params.coin].baseurl + address + '/balance';
        let response = await fetch(url);
        response = await response.json();

        // Overwrite old details and write to file
        details[req.params.coin].accounts[req.params.type] = response;
        fs.writeFileSync('./data/details.json', JSON.stringify(details));

        return res.json({ status: 'Writing in the background...' });
    } catch (err) {
        res.status(400).json({ error: err });
    }
}