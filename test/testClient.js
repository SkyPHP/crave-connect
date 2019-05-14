/**
 * Created by cj on 11/5/17.
 */
'use strict'; 

var Client = require('../index'); 

describe('Testing API Client', function() {
    var client = null ;
    
    before(done => {
        
        client = new Client({
            token   : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoiYzhlYzAyZjQtMzZkMi0xMWU5LThiOTctMGFiMDViNjZiMWUyIiwiZXhwIjoxNTY0NjIzODk4LCJhY2NvdW50X2lkIjoiM2ZhMTBmNjAtY2I2ZS0xMWU3LTgzNWUtMGFlZTgzNTM0ZjJhIiwicm9sZXMiOlsic3VwZXIiLCJ0ZWxlbWFya2V0aW5nIl0sImlhdCI6MTU1Njg0Nzg5OH0.ZTRfcJpGlgKAa5ZVfdzANOXBJpDeOyEJuW40XvEXz1A',
            env     : 'dev'
        })
        
        done(); 
    });

    it('Should return a list of events', done => {
        client.list_events({
            market_id : 1
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

    it('Should return a list of venues', done => {
        client.list_venues({ }).then(data => {
            console.log('data', data);
            done();
        }).catch(err => done(err))

    })

    it('Should return a single venue', done => {
        client.get_venue({
            id: '96735dfe-ce78-11e7-8639-0aee83534f2a'
        }).then(data => {
            console.log('data', data);
            done();
        }).catch(err => done(err))

    })

    it('Should return a list of careers', done => {
        client.list_careers({
            market_id : 1
        }).then(data => {
            console.log('data', data);
            done();
        }).catch(err => done(err))
    })

})