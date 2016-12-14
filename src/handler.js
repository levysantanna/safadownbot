const fetch = require('node-fetch');
const random = require('seedrandom');

class Handler {
    constructor() {
        return this._callback.bind(this);
    }

    ['/safadometro'](message) {
        const today = new Date();
        const seed = Number(String(message.from.id) + String(today.getDate()) + String(today.getMonth()) + String(today.getYear()));
        const anjo = Math.round(random(seed)() * 100);
        const vagabundo = 100 - anjo;
        const body = JSON.stringify({
          chat_id: message.chat.id,
          text: `Hoje ${message.from.first_name || message.from.username || 'Sei lá quem'} está ${anjo}% anjo mas aquele ${vagabundo}% é vagabundo!`
        });
        
        return fetch(`https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`, { 
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': new Buffer(body).length
            }
        })
        .then((r) => r.json());
    }
    
    ['/mimimi'](message) {
        const mimimi = message.text
            .replace(/(a|e|o|u)/g, 'i')
            .replace(/(A|E|O|U)/g, 'I')
            .replace(/(á|é|ó|ú)/g, 'í')
            .replace(/(Á|É|Ó|Ú)/g, 'Í')
            .replace(/(à|è|ò|ù)/g, 'í')
            .replace(/(À|È|Ò|Ù)/g, 'Í')
            .replace(/(â|ê|ô|û)/g, 'Î')
            .replace(/(Â|Ê|Ô|Û)/g, 'Î')
            .replace(/(ã|õ)/g, 'I')
            .replace(/(Ã|Õ)/g, 'I');
        const body = JSON.stringify({
          chat_id: message.chat.id,
          text: mimimi
        });
        
        return fetch(`https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`, { 
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': new Buffer(body).length
            }
        })
        .then((r) => r.json());
    }
    
    ['/safadometro@safadown_bot'](message) {
        return this['/safadometro'](message);
    }
    
    ['/mimimi@safadown_bot'](message) {
        return this['/mimimi'](message);
    }

    _callback(req, res) {
        this._logMessage(req.body.message);
        
        if (!this._isCommand(req.body.message)) {
            res.status(200).send({ ok: true });
            return;
        }
        
        const message = this._parseMessage(req.body.message);
        
        if (!this[message.command]) {
            res.status(200).send({ ok: true });
            return;
        }
        
        const promise = this[message.command](message);
        
        promise
            .then(() => { 
                res.status(200).send({ ok: true });
            })
            .catch((error) => {
                res.status(500).send({ ok: false }); 
                this._logMessage(error);
            });
    }
        
    _isCommand(message) {
        if (!message || !message.entities) {
            return false;
        }
        
        return message.entities.some((entity) => entity.type === 'bot_command');
    }
    
    _logMessage(message) {
        if (!message) {
            return;
        }
        
        if (process.env.LOG && process.env.LOG.toLowerCase() === 'true') {
            console.log(JSON.stringify(message));
        }
    }

    _parseMessage(message) {
        const entity = message.entities[0];
        const text = message.text.split('');
        message.command = text.splice(entity.offset, entity.offset + entity.length).join('');
        text.shift();
        message.text = text.join('');
        return message;
    }
}

module.exports = Handler;