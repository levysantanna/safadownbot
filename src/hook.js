const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const Handler = require('./handler');

class Hook {
    constructor() {
        this.server = express();
        this.server.use(bodyParser.json());
        this.server.use(cors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false
        }));
        
        this.server.post('*', new Handler());
        this.server.all('*', function (req, res) {
            res.status(200).send({
                now: Date.now()
            })
        });
        
        return this.server;
    }
}

module.exports = Hook;