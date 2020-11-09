const express = require('express');
const cors = require('cors')
const fs = require('fs');
const fsextra = require('fs-extra')
const yaml = require('js-yaml');
var jwt = require('jsonwebtoken');

const app = express()
app.use(express.json())
app.use(cors())

const repositoryUsuarios = require('./repository/repository')('usuarios');
const repositoryPermissoes = require('./repository/repository')('permissoes');

app.post('/login', (req, res) => {
    repositoryUsuarios.collection().findOne({ login: req.body.user }, function (err, usuario) {
        if (usuario.senha === req.body.pwd) {
            const id = usuario._id; //esse id viria do banco de dados
            const user = req.body.user;
            console.log(id)

            //{ guidusuario: '5f974ec0ae28c75552a25573' }
            repositoryPermissoes.collection().find().toArray((err, permissoes) => {
                var arrayPermissoes = [];
                permissoes.map(function(key) {
                    arrayPermissoes.push(key.permissao);
                });

                console.log(arrayPermissoes);
                var token = jwt.sign({ id, user, permissoes : arrayPermissoes }, 'AulaSistemasConvergentes2.0', {
                    expiresIn: 300 // expires in 5min
                });
                return res.json({ auth: true, token: token });
            })
        } else {
            res.status(403).json({ message: 'Login inválido!' });
        }
    });
});

app.get('/usuarios/buscar/:cpf', (req, res) => {
    const { cpf } = req.params

    repositoryUsuarios.collection().find({ cpf: cpf }).toArray((err, usuario) => {
        res.status(200).json(usuario)
     })
});

//app.listen(data['port'])
var porta = process.env.PORT || 81;
app.listen(porta, '0.0.0.0');