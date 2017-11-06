/**
 * Created by cj on 11/5/17.
 */
'use strict'; 

const svc = module.exports = {};

svc.tokenRequiredError = function() {
    var err = new Error('Token is required');
    throw err;
}

svc.idRequiredError = function() {
    var err = new Error('Id is required');
    throw err;
}
