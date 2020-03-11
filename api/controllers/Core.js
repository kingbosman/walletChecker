const fs = require('fs');
const Joi = require('@hapi/joi');

const CoreController = require('../models/Core');

let status = 500;
const detailsFile = './data/details/{{coin}}.json';
const modelFile = '../models/{{coin}}';
const fsModelPath = './api/models/{{coin}}.js';
const controllerFile = '../controllers/{{coin}}';
const fsControllerPath = './api/controllers/{{coin}}.js';

// POST new address for coin
// REQUIRED: body address, coin, type
// TODO after address is set get balance; if invalid remove address-type from array
exports.setAddress = async(req, res) => {
    try {
        const overwrite = req.query.overwrite;
        const { address, type, coin } = req.body;

        // Set schema for validation
        const schema = Joi.object({
            address: Joi.string().alphanum().required(),
            type: Joi.string().alphanum().required(),
            coin: Joi.string().alphanum().required()
        });
        // Validate
        const validate = schema.validate(req.body);
        if (validate.error) throw validate.error.details[0].message;

        // Load model or reject when not exist
        if (!fs.existsSync(fsModelPath.replace("{{coin}}", coin))) {
            status = 404;
            throw `Model for ${coin} does not exist.`
        }
        const Model = require(modelFile.replace("{{coin}}", coin));

        // If non existent details file create template file for coin
        const file = detailsFile.replace("{{coin}}", coin);
        if (!fs.existsSync(file)) {
            Model.writeFile();
        }

        // Get the file
        const details = await Model.getDetails();

        // If overwrite is false check if address exist and reject if exists
        if (!overwrite) {
            if (details.accounts[type]) {
                status = 400;
                throw `Address for type ${type} already exists. Set overwrite to true to overwrite.`
            }
        }
        // Finally write new address in file
        const newAddress = await Model.updateAddress(type, address);

        status = 201;
        res.status(status).json({
            result: 'success',
            data: newAddress
        });

    } catch (err) {
        res.status(status).json({ error: err })
    }

};

// GET details for specific coin
exports.getCoinDetails = async(req, res) => {
    try {
        // Set needed consts
        const coin = req.params.coin;
        const file = detailsFile.replace("{{coin}}", coin);

        // Load model or reject when not exist
        if (!fs.existsSync(fsModelPath.replace("{{coin}}", coin))) {
            status = 404;
            throw `Model for ${coin} does not exist.`
        }
        const Model = require(modelFile.replace("{{coin}}", coin));

        // Check if exists check
        if (!fs.existsSync(file)) {
            status = 404;
            throw `Details for ${coin} does not exist, please setup an address first`;
        }

        // get all details from [coin]
        const details = await Model.getDetails();
        status = 200;

        res.status(status).json({
            result: 'success',
            data: details
        });
    } catch (err) {
        res.status(status).json({ error: err })
    }
};


exports.updateAddressBalance = async(req, res) => {
    try {
        const coin = req.params.coin;
        const type = req.params.type;
        const file = detailsFile.replace("{{coin}}", coin);

        // Check if details exists check
        if (!fs.existsSync(file)) {
            console.log(113);
            status = 404;
            throw `Details for ${coin} does not exist, please setup an address first`;
        }

        // Get address if exists or throw
        const details = await CoreController.getCoinDetails(coin);
        if (!details.accounts[type]) {
            status = 400;
            throw `Address for [${type}] is not found, please set it up first.`;
        }
        const address = details.accounts[type].address;

        // Load controller or reject when not exist
        if (!fs.existsSync(fsControllerPath.replace("{{coin}}", coin))) {
            status = 404;
            throw `Controller for ${coin} does not exist.`
        };
        const Controller = require(controllerFile.replace("{{coin}}", coin));
        const result = await Controller.updateAddressBalance(address);

        // If {coin} controller returns error throw error
        if (result.errmessage) {
            status = 400;
            throw result.errmessage
        };

        // TODO get data to return (validated)


        // finally reeturn data
        status = 200;
        res.status(status).json({
            result: 'success',
            data: result
        });
    } catch (err) {
        res.status(status).json({ error: err });
    }
}