var ObjectId = require("mongojs").ObjectId;
var request = require('request');

module.exports = () => {
    const controller = {};

    const repository = require('../repository/repository')('estacionamento');
    const repositoryVeiculo = require('../repository/repository')('veiculos');
    const repositoryEstacionamento = require('../repository/repository')('estacionamento');

    controller.listarEstacionamento = (req, res) => {
        repository.collection().find().toArray((err, estacionamento) => {
            res.status(200).json(estacionamento);
        })
    }

    controller.estacionar = (req, res) => {
        const estacionar = req.body

        repositoryVeiculo.collection().find({ placa: estacionar.placa }).toArray((err, veiculo) => {
            var guidVeiculo = veiculo[0]._id;
            
            request('http://localhost:81/usuarios/buscar/'+estacionar.cpf, function (error, response, body) {
                body = JSON.parse(body);
                var guidUsuario = body[0]._id;

                repositoryEstacionamento.collection().insertOne({guidVeiculo: guidVeiculo, guidUsuario: guidUsuario, vaga : estacionar.vaga, hora: estacionar.hora}, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("OK")
                    }
                })

                res.status(200).send()
            })            
        })

        /*repository.collection().insertOne(veiculo, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log("OK")
            }
        })*/


    };

    return controller;
}