const fs = require('fs');
const Joi = require('@hapi/joi');

const CoreController = require('../models/Core');

let status = 500;

// TODO Remove needed (non used)
const detailsFile = './data/details/{{coin}}.json';
const modelFile = '../models/{{coin}}';
const fsModelPath = './api/models/{{coin}}.js';
const controllerFile = '../controllers/{{coin}}';
const fsControllerPath = './api/controllers/{{coin}}.js';


exports.test = async(req, res) => {
    const TestModel = require('../models/db/Currency');

    try {
        const result = await TestModel.getActiveCurrencyOverview();

        res.json({
            result: result
        })
    } catch (err) {
        res.json({
            err: err
        })
    }
}

// POST new address for coin
// REQUIRED: body address, coin, type
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
        // TODO determine if still need to load model
        if (!fs.existsSync(fsModelPath.replace("{{coin}}", coin))) {
            status = 404;
            throw `Model for ${coin} does not exist.`
        }
        const Model = require(modelFile.replace("{{coin}}", coin));

        // TODO remove files move to DB
        // If non existent details file create template file for coin
        const file = detailsFile.replace("{{coin}}", coin);
        if (!fs.existsSync(file)) {
            Model.writeFile();
        }

        // TODO get from DB
        // Get the file
        const details = await Model.getDetails();

        // If overwrite is false check if address exist and reject if exists
        if (!overwrite) {
            if (details.accounts[type]) {
                status = 400;
                throw `Address for type ${type} already exists. Set overwrite to true to overwrite.`
            }
        }

        // Rreject when controller does not exist
        if (!fs.existsSync(fsControllerPath.replace("{{coin}}", coin))) {
            status = 404;
            throw `Controller for ${coin} does not exist.`
        }

        // Load controller
        const Controller = require(controllerFile.replace("{{coin}}", coin));

        // If address does not exist don't write?
        const addressExists = await Controller.getAddressBalance(address);
        if (addressExists.errmessage) throw addressExists.errmessage;

        // TODO Write to DB
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
        // TODO remove file move to DB
        const file = detailsFile.replace("{{coin}}", coin);

        // TODO check if model still needed
        // Load model or reject when not exist
        if (!fs.existsSync(fsModelPath.replace("{{coin}}", coin))) {
            status = 404;
            throw `Model for ${coin} does not exist.`
        }
        const Model = require(modelFile.replace("{{coin}}", coin));

        // TODO remove file use DB
        // Check if exists check
        if (!fs.existsSync(file)) {
            status = 404;
            throw `Details for ${coin} does not exist, please setup an address first`;
        }

        // TODO check if needed or just DB select
        // get all details from [coin]
        const details = await Model.getDetails();
        status = 200;

        res.status(status).json({
            result: 'success',
            details
        });
    } catch (err) {
        res.status(status).json({ error: err })
    }
};


exports.updateAddressBalance = async(req, res) => {
    try {
        const coin = req.params.coin;
        const type = req.params.type;
        // TODO remove file move to DB
        const file = detailsFile.replace("{{coin}}", coin);

        // TODO move file to DB
        // Check if details exists check
        if (!fs.existsSync(file)) {
            status = 404;
            throw `Details for ${coin} does not exist, please setup an address first`;
        }

        // TODO this is also from a file, use DB instead
        // Get address if exists or throw
        const details = await CoreController.getCoinDetails(coin);
        if (!details.accounts[type]) {
            status = 400;
            throw `Address for [${type}] is not found, please set it up first.`;
        }
        const address = details.accounts[type].address;

        // Reject when controller does not exist
        if (!fs.existsSync(fsControllerPath.replace("{{coin}}", coin))) {
            status = 404;
            throw `Controller for ${coin} does not exist.`
        }

        // Load controller
        const Controller = require(controllerFile.replace("{{coin}}", coin));

        // TODO Move from fiel to DB
        // Update balance
        const result = await Controller.updateAddressBalance(address, type);

        // If {coin} controller returns error throw error
        if (result.errmessage) {
            status = 400;
            throw result.errmessage
        }

        // finally return data
        status = 200;
        res.status(status).json({
            result: 'success',
            data: result
        });
    } catch (err) {
        res.status(status).json({ error: err });
    }
}

exports.getAddressBalance = async(req, res) => {
    try {
        const coin = req.params.coin;
        const address = req.params.address;

        // Reject when controller does not exist
        if (!fs.existsSync(fsControllerPath.replace("{{coin}}", coin))) {
            status = 404;
            throw `Controller for ${coin} does not exist.`
        }

        // Load controller
        const Controller = require(controllerFile.replace("{{coin}}", coin));

        // Get balance data
        const result = await Controller.getAddressBalance(address);

        // If {coin} controller returns error throw error
        if (result.errmessage) {
            status = 400;
            throw result.errmessage
        }

        // finally return data
        status = 200;
        res.status(status).json({
            result: 'success',
            data: result
        });
    } catch (err) {
        res.status(status).json({ error: err });
    }
}