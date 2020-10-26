const express = require('express');
const cors = require('cors')
const fs = require('fs');
const fsextra = require('fs-extra')
const yaml = require('js-yaml');
var jwt = require('jsonwebtoken');

const app = express()
app.use(express.json())
app.use(cors())

//let env = process.env.NODE_ENV;
//if (env == undefined) {
//    env = 'dev';
//}

let data;

try {
    let fileContents = fs.readFileSync('./src/resources/endpoints.yaml', 'utf8');
    data = yaml.safeLoad(fileContents);
} catch (e) {
    console.log(e);
}

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
})

/*
 * ROLES DO SISTEMA
 *
 * USUARIO_LISTAGEM
 * USUARIO_EDICAO 
 * VEICULO_LISTAGEM
 * VEICULO_EDICAO
 * 
 */

function verifyJWT(req, res, next) {
    var token = req.headers['x-access-token'];

    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

    jwt.verify(token, 'AulaSistemasConvergentes2.0', function (err, decoded) {
        if (err) {
            console.log(err)
            return res.status(500).json({ auth: false, message: err.message });
        }

        // se tudo estiver ok, salva no request para uso posterior
        console.log(decoded.id)
        console.log(decoded.user)
        console.log(decoded.permissoes)

        next();
    });
}

const veiculos = require('./routes/veiculos.route');
const endpoints = require('./routes/endpoints.route');

//const blockedIps = ['192.168.15.161']

//app.use(function (req, res, next) {
//    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
//    if (ip.substr(0, 7) == "::ffff:") {
//        ip = ip.substr(7)
//    }

//    if (blockedIps.includes(ip)) {
//        return res.send('IP bloqueado')
//    }
//
//    return next()
//})

//ler o arquivo documento.doc do c:\ e copiar para a pasta storage
//fsextra.move('/Users/CLEVERSONAVELINOFerr/Desktop/softwares/documento.doc', './src/storage/documento.doc', function (err) {
//    if (err) return console.error(err)
//    console.log("success!")
//})

app.use('/veiculo', verifyJWT, veiculos)
data['endpoints'].forEach(function (endpoint) {
    app.use('/*', endpoints)
});

app.use((error, req, res, next) => {
    console.log('error')
    res.status(error.httpStatusCode).json(error)
})

//app.listen(data['port'])
var porta = process.env.PORT || 80;
app.listen(porta);