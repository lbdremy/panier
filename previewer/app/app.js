/**
 * Module dependencies
 */

var http = require('http');
var app = require('express')();
var routes = require('./routes');
var configure = require('./configure');

/**
 * Configure the app
 */

configure(app);

/**
 * Mount the routes
 */

routes(app);

/**
 * Start the server
 */

var server = http.createServer(app);
var port = process.env['PORT'] || 1102;
server.listen(port,function(){
	console.log('Server running on port',port,'...');
});