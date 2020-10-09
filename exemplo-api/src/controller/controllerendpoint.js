module.exports = () => {

    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database : 'hi',
    });

    connection.connect(function (err) {
        console.log('conectou')
    });

    const controller = {};

    controller.save = (req, res) => {
        var post = req.body;

        var endpoint = req.originalUrl.replace("/","");
                
        var query = connection.query('INSERT INTO '+endpoint+' SET ?', post, function (err, result) {
            console.log('insert ok')
        });
        console.log(query.sql);

        res.status(200).send()
    };


    return controller;
}