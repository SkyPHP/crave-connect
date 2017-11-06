/**
 * Created by cj on 11/5/17.
 */
'use strict'; 

var Client = require('../lib/client'); 

describe('Testing API Client', function() {
    var client = null ;
    
    before(done => {
        
        client = new Client({
            token   : 'r11ExLh7lBke1NlLnmeHy@yNg8nmx', 
            staging : true
        })
        
        done(); 
    });

    it('Should return a list of events', done => {
        client.list_events({
            market: 1
        }).then(data => {
            console.log('data', data);
            done();
        }).catch(err => done(err))

    })
    
    it('Should return a single event', done => {
        client.get_event({
            id: '4678ad2c-adf3-11e7-a99f-067dcd62e170'
        }).then(data => {
            console.log('data', data);
            done();
        }).catch(err => done(err))

    })
})