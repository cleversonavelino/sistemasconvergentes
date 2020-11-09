const estacionamento = require('express').Router();

const controllerEstacionamento = require('../controller/controllerestacionamento')();

estacionamento.get('/listar', controllerEstacionamento.listarEstacionamento);
estacionamento.post('/estacionar', controllerEstacionamento.estacionar);

module.exports = estacionamento;