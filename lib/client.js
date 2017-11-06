/**
 * Created by cj on 11/5/17.
 */
'use strict'; 

const xhr = require('xhr'); 
const xhr2 = require('xhr2');
const xtend = require('xtend');
const querystring = require('querystring');
const Promise = require('bluebird');


const config = require('./config'); 
const errors = require('./errors'); 

var Client = module.exports = function Client (opts) {
    if (!(this instanceof Client)) {
        return new Client(opts)
    }
    
    if(!opts || !opts.token) {
        errors.tokenRequiredError(); 
    }
    
    this.options = opts; 
    
    this.baseUrl = opts.staging ? config.staging.url : config.default.url;

    this.headers = {
        'Content-Type': 'application/json'
    };
}

if (typeof window !== 'undefined') {
    window.CraveIO = Client
}

////// utility methods //////

Client.prototype.request = function (opts) {
    var self = this
    var headers = xtend(self.headers)

    var qs = ''
    if (opts.query) {
        qs = '?' + querystring.stringify(opts.query)
    }

    if(opts.xhr_debug) {
        console.log({"client"  :"0.0.1" , "opts" : opts , "uri" : self.baseUrl + opts.uri + qs});
    }

    return new Promise((resolve , reject) => {
        xhr({
            method: opts.method,
            uri: self.baseUrl + opts.uri + qs,
            headers: headers,
            json: opts.body,
            xhr: new xhr2()
        }, function (err, resp, body) {
            if (err) {
                return reject(err)
            }
            var ok = [200, 201]
            if (ok.indexOf(resp.statusCode) === -1) {
                return reject(body.error || body)
            }

            if(!body) {
                return reject("No response");
            }

            if(body.error) {
                return reject(body.error);
            }

            resolve(body);
        })

    })
}



Client.prototype.list_events = function (opts) {
    return this.request({
        method: 'get',
        uri: '/events',
        xhr_debug : 1,
        query: opts
    });
}

Client.prototype.get_event = function (opts) {
    if(!opts.id) 
        errors.idRequiredError(); 
    
        
    return this.request({
        method: 'get',
        uri: '/events/' + (opts.id),
        xhr_debug : 1,
        query: opts
    });
}