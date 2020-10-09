const endpoints = require('express').Router();

const controllerEndpoint = require('../controller/controllerendpoint')();

endpoints.post('/', controllerEndpoint.save)

module.exports = endpoints;