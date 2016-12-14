const fetch = require('node-fetch');
const Hook = require('./hook');

class Safadown {
    start() {
        this._verifyBot()
            .then(() => this._startHook())
            .then(() => this._setHook());
    }
    
    _verifyBot() {
        return fetch(`https://api.telegram.org/bot${process.env.API_KEY}/getMe`)
            .then((response) => response.json())
            .then((data) => {
                if (!data.ok) {
                    return Promise.reject(new Error('Failed to verify bot'));
                }
                
                console.log(`Bot OK! Starting ${data.result.first_name}.`);
                
                return Promise.resolve();
            });
    }
    
    _startHook() {
        const hook = new Hook();
        
        console.log(`Starting hook server on port ${process.env.PORT}`);
        
        return hook.listen(process.env.PORT);
    }
    
    _setHook() {
        const body = JSON.stringify({ url: process.env.HOOK_URL });
        
        return fetch(`https://api.telegram.org/bot${process.env.API_KEY}/setWebhook`, { 
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': new Buffer(body).length
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.ok) {
                    return Promise.reject(new Error(`Failed to set hook on URL ${process.env.HOOK_URL}`));
                }
                
                console.log(`Hook OK! ${process.env.HOOK_URL}`);
                
                return Promise.resolve();
            });
    }
}

module.exports = Safadown;