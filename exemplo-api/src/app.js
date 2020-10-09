const express = require('express');
const cors = require('cors')
const fs = require('fs');
const fsextra = require('fs-extra')
const yaml = require('js-yaml');

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

app.use('/veiculo', veiculos)
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