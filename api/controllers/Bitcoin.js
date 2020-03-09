const address = details[req.params.coin].accounts[req.params.type].address;
const api_url_base = 'https://api.blockcypher.com/v1/btc/main/addrs/';

// check if address is registered
if (!address || address == 'x') throw `Address not known for ${req.params.type}`

// Get new details
const url = api_url_base + address + '/balance';
let response = await fetch(url);
response = await response.json();

// Overwrite old details and write to file
details[req.params.coin].accounts[req.params.type].data = response;
await fs.writeFileSync('./data/details.json', JSON.stringify(details));
// FIXME end here and return for data, also create function for switching between coins