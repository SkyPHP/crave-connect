/**
 * Created by cj on 11/5/17.
 */
'use strict'; 

const xhr = require('xhr'); 
const xhr2 = require('xhr2');
const xtend = require('xtend');
const querystring = require('querystring');
const Promise = require('bluebird');
const merge = require('deepmerge');

const config = require('./config'); 
const errors = require('./errors'); 

var Client = module.exports = function Client (opts) {
    if (!(this instanceof Client)) {
        return new Client(opts)
    }
    
    if(!opts || !opts.token) {
        errors.tokenRequiredError(); 
    }
    
    if(!opts.env && opts.staging) {
        opts.env = 'staging'; 
    }
    
    this.options = opts;
    this.token = opts.token;


    this.config = config[opts.env] || config.default; 
    this.baseUrl = this.config.url;
    

    this.headers = {
        'Content-Type': 'application/json',
        'x-access-token': opts.token
    };
}

if (typeof window !== 'undefined') {
    window.CraveIO = Client
}

////// utility methods //////

Client.prototype.request = function (opts) {
    var self = this
    var headers = xtend(self.headers)

    opts.query = opts.query || {};
    opts.query.oauth_token = this.token; 
    var qs = '?' + querystring.stringify(opts.query)

    if(opts.xhr_debug) {
        console.log('headers: ' ,headers)
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

            if(!body) {

                console.log('headers: ' ,headers)
                console.log({"client"  :"0.0.1" , "opts" : opts , "uri" : self.baseUrl + opts.uri + qs});

                return reject("No response");
            }


            if (ok.indexOf(resp.statusCode) === -1) {
                console.log('headers: ' ,headers)
                console.log({"client"  :"0.0.1" , "opts" : opts , "uri" : self.baseUrl + opts.uri + qs});

                return reject(body.error || body)
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
        query: opts
    });
}

Client.prototype.get_event = function (opts) {
    if(!opts.id) 
        errors.idRequiredError(); 
    
        
    return this.request({
        method: 'get',
        uri: '/events/' + (opts.id),
        query: opts
    });
}

Client.prototype.list_venues = function (opts) {
    return this.request({
        method: 'get',
        uri: '/venues',
        query: opts
    });
}

Client.prototype.get_venue = function (opts) {
    if(!opts.id)
        errors.idRequiredError();

    return this.request({
        method: 'get',
        uri: '/venues/' + (opts.id),
        query: opts
    }).then(venue => {
        return Promise.props({
            venue,
            events: this.request({
                method: 'get',
                uri: '/events',
                query: {
                    venue_id: venue.id,
                    mode: 'full'
                }
            })
        });
    }).then(results => {
        const venue = results.venue;
        venue.events = results.events;

        console.log(venue.events)
        return venue;
    })

}

Client.prototype.website = function (opts) {
    if(!opts.id) 
        errors.idRequiredError(); 
    
        
    return this.request({
        method: 'get',
        uri: '/websites/reseller/' + (opts.id),
        query: opts
    });
}

Client.prototype.newsletter_signup = function (opts) {
    return this.request({
        method: 'post',
        uri: '/prospects',
        body: opts
    });
}

Client.prototype.post_prospect = function (opts) {
    return this.request({
        method: 'post',
        uri: '/prospects',
        body: opts
    });
}

Client.prototype.blog = function (opts) {
    const action = opts.action? `/${opts.action}` : '';

    return this.request({
        method: 'get',
        uri: `/blogs${action}`,
        query: opts
    });
}

Client.prototype.blog_articles = function (opts) {
    const action = opts.action? `/${opts.action}` : '';

    return this.request({
        method: 'get',
        uri: `/blogs/articles${action}`,
        query: opts
    });
}

Client.prototype.blog_post = function (opts) {
    return this.request({
        method: 'post',
        uri: `/blogs`,
        body: opts
    });
}

Client.prototype.blog_post_article = function (opts) {
    return this.request({
        method: 'post',
        uri: `/blogs/articles`,
        body: opts
    });
}

Client.prototype.list_careers = function (opts) {
    return this.request({
        method: 'get',
        uri: '/careers',
        query: opts
    });
}

Client.prototype.get_career = function (opts) {
    if(!opts.id)
        errors.idRequiredError();


    return this.request({
        method: 'get',
        uri: '/careers/' + (opts.id),
        query: opts
    });
}

Client.prototype.post_candidate = function (opts) {
    return this.request({
        method: 'post',
        uri: '/candidates',
        body: opts
    });
}

Client.prototype.login = function (opts) {
    return this.request({
        method: 'post',
        uri: '/authenticate',
        body: opts
    });
}

Client.prototype.sign_up = function (opts) {
    return this.request({
        method: 'post',
        uri: '/register',
        body: opts
    });
}