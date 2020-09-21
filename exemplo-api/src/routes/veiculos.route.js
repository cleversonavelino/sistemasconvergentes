const veiculos = require('express').Router();

const controllerVeiculo = require('../controller/controllerveiculo')();

veiculos.get('/', controllerVeiculo.listarVeiculos);
veiculos.post('/', controllerVeiculo.salvarVeiculo)
veiculos.put('/', controllerVeiculo.alterarVeiculo)
veiculos.delete('/', controllerVeiculo.excluirVeiculo)

veiculos.get('/buscar/:placa', controllerVeiculo.buscarVeiculos)
veiculos.get('/calcular', controllerVeiculo.calcular)
veiculos.get('/calcularipva', controllerVeiculo.calcularipva)
veiculos.get('/somatorioipva', controllerVeiculo.somatorioipva)
veiculos.post('/upload', controllerVeiculo.upload)

veiculos.get('/download/:nomeArquivo', controllerVeiculo.download)

module.exports = veiculos;