var formidable = require('formidable');
const fsextra = require('fs-extra')
const fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require("mongojs").ObjectId;


module.exports = () => {
    const controller = {};

    const imagens = [];

    var collectionVeiculos;
    var uri = "mongodb://positivo:123456ab@cluster0-shard-00-00.2bftd.mongodb.net:27017,cluster0-shard-00-01.2bftd.mongodb.net:27017,cluster0-shard-00-02.2bftd.mongodb.net:27017/sistemasconvergentes?ssl=true&replicaSet=atlas-fbg0ts-shard-0&authSource=admin&retryWrites=true&w=majority";
    MongoClient.connect(uri, function (err, client) {
        if (err) {
            console.log(err)
        }

        const db = client.db('sistemasconvergentes')
        collectionVeiculos = db.collection('veiculos')
    });

    controller.listarVeiculos = (req, res) => {
        collectionVeiculos.find().toArray((err, veiculos) => {
            res.status(200).json(veiculos);
        })
    }

    /*  o usuário envia uma foto do veiculo  */
    controller.upload = (req, res, next) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            const { type, name, path, size } = files.arquivo

            console.log("tamanho: " + size)

            if (size > 111110000) {
                const error = new Error();
                error.message = "tamanho do arquivo inválido";
                error.httpStatusCode = 400;
                error.code = 'ERR001';
                return next(error)
            }

            if (type.indexOf("image/png") != -1) {
                console.log("vai mover o arquivo");

                try {
                    await fsextra.move(files.arquivo.path, './src/storage/' + files.arquivo.name)
                    console.log("terminou de mover");

                    res.write('Arquivo Carregado');
                    res.end();
                } catch (err) {
                    const error = new Error();
                    error.message = "arquivo já existe";
                    error.httpStatusCode = 400;
                    error.code = 'ERR004';
                    return next(error)
                }

                /*promise.then(function() {
                    console.log("terminou de mover");
                    res.write('Arquivo Carregado');
                    res.end();
                },
                function() {
                    const error = new Error();
                    error.message = "arquivo já existe";
                    error.httpStatusCode = 400;
                    error.code = 'ERR004';
                    return next(error)
                }) */
            } else {
                const error = new Error()
                error.message = "tipo do arquivo inválido"
                error.httpStatusCode = 400;
                error.code = 'ERR002';
                return next(error)
            }
        });
    };

    controller.download = (req, res, next) => {
        const { nomeArquivo } = req.params

        try {
            let readStream = fs.createReadStream('./src/storage/' + nomeArquivo)

            readStream.on('open', function () {
                readStream.pipe(res)
            });
        } catch (err) {
            const error = new Error()
            error.message = "não foi possível realizar o download do arquivo"
            error.httpStatusCode = 400
            error.code = 'ERR003'
            return next(error)
        }
    }

    controller.salvarVeiculo = (req, res) => {
        const veiculo = req.body

        collectionVeiculos.insertOne(veiculo, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log("OK")
            }
        })

        res.status(200).send()
    };

    controller.alterarVeiculo = (req, res) => {
        const veiculo = req.body

        var id = veiculo._id;
        delete veiculo._id;

        collectionVeiculos.updateOne({ _id: require("mongojs").ObjectId(id) }, { $set: veiculo }, (err, item) => {
            console.log(err)
        })

        res.status(200).send()
    };

    controller.excluirVeiculo = (req, res) => {
        collectionVeiculos.deleteOne({ _id: require("mongojs").ObjectId(req.body._id) }, (err, item) => {
            console.log(err)
        })

        res.status(200).send()
    };

    controller.buscarVeiculos = (req, res) => {
        const { placa } = req.params
        //res.status(200).json(veiculos.filter((veiculo) => {
        //    return veiculo.placa === placa;
        //}))
        collectionVeiculos.find({ placa: placa }).toArray((err, veiculos) => {
            res.status(200).json(veiculos);
        })
        //collectionVeiculos.findOne({placa: placa}, (err, item) => {
        //    res.status(200).json(item);
        //})
    }

    controller.calcular = (req, res) => {
        collectionVeiculos.find().toArray((err, veiculos) => {
            var valor = veiculos.reduce(function (valor, item) {
                valor += parseInt(item.valor)
                return valor
            }, 0);
            res.status(200).json(valor)
        });
    }

    controller.calcularipva = (req, res) => {
        collectionVeiculos.find().toArray((err, veiculos) => {
            veiculos.map((veiculo) => {
                veiculo.ipva = veiculo.valor * 0.035

                var id = veiculo._id;
                delete veiculo._id;

                collectionVeiculos.updateOne({ _id: require("mongojs").ObjectId(id) }, { $set: veiculo }, (err, item) => {
                    console.log(err)
                })
            });
            res.status(200).json(veiculos)
        });
    };

    controller.somatorioipva = (req, res) => {
        collectionVeiculos.find().toArray((err, veiculos) => {
            var valor = veiculos.reduce(function (valor, item) {
                valor += parseFloat(item.ipva)
                return valor
            }, 0);

            res.status(200).json(valor)
        });
    }

    return controller;
}